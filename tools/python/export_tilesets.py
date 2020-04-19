#####
#   Generates a single level.json file containing all used data for each level
#####
import os
import json

# Run a bat file to export all the maps as json files
os.system(os.getcwd() + '\\tools\\batch\\export_tiled_maps.bat')

json_ouput = {}
source_dir = './assets_source/maps/export/'
directory = os.fsencode(source_dir)

# Iterate through every json file for every map
for filename in os.listdir(directory):
    # Getting the json content
    file = open(source_dir + filename.decode('utf-8'), 'r')
    json_string = file.read()
    file.close()
    json_content = json.loads(json_string)

    # Read the tileset file
    tileset_path = source_dir + json_content['tilesets'][0]['source']
    tileset_file = open(tileset_path, 'r')
    tileset_content = tileset_file.read()
    tile_id = -1
    tiles_solid = []
    tiles_semisolid = []
    tiles_spikes = []
    tiles_goal = []
    tiles_onoff = {'switch_a':[], 'block_a':[], 'switch_b':[], 'block_b':[]}
    custom_hitboxes = {}
    for line in tileset_content.splitlines():
        if 'tile id' in line:
            tile_id += 1
        elif '"tiletype"' in line and '"solid"' in line:
            tiles_solid.append(tile_id)
        elif '"tiletype"' in line and '"semisolid"' in line:
            tiles_semisolid.append(tile_id)
        elif '"tiletype"' in line and '"spikes"' in line:
            tiles_spikes.append(tile_id)
        elif '"tiletype"' in line and '"goal"' in line:
            tiles_goal.append(tile_id)
        elif 'hitbox' in line:
            if not str(tile_id) in custom_hitboxes:
                custom_hitboxes[str(tile_id)] = {}
            if '"hitbox_y"' in line:
                custom_hitboxes[str(tile_id)]['y'] = int(line.split('value="', 1)[1].replace('"/>', ''))
            if '"hitbox_height"' in line:
                custom_hitboxes[str(tile_id)]['height'] = int(line.split('value="', 1)[1].replace('"/>', ''))
        elif 'onoff_' in line:
            onoff_type = line.split('onoff_', 1)[1].replace('"/>', '')
            tiles_onoff[onoff_type].append(tile_id)
            
    tileset_file.close()
    
    # Create the levels json
    json_line = {
        'columns': json_content['width'],
        'rows': json_content['height'],
        'tiles': json_content['layers'][0]['data'],
        'tileset': json_content['tilesets'][0]['source'].replace('../', '').replace('.tsx', ''),
        'solidTiles': tiles_solid,
        'semisolidTiles': tiles_semisolid,
        'onoff': tiles_onoff,
        'spikes': tiles_spikes,
        'goal': tiles_goal,
        'customHitboxes': custom_hitboxes,
    }
    json_ouput[filename.decode('utf-8').replace('.json', '')] = json_line

# Uses all gathered data to output a single levels.json file
output_dir = './dist/assets/' + 'levels.json'
output_file = open(output_dir, 'w+')
output_file.write(json.dumps(json_ouput))
output_file.close()