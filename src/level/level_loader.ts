class LevelLoader {

    public readonly scene: Phaser.Scene;

    constructor(scene:Phaser.Scene) { 
        this.scene = scene;
    }

    public preloadJsonFiles():void {
        this.scene.load.json('levels', 'assets/levels.json');
    }

    public load(name:string):Level {
        let levelJson = this.scene.cache.json.get('levels')[name];
        let map = this.createTilemap(levelJson);

        return new Level(map);
    }

    private createTilemap(levelJson: any):Tilemap {
        let tilesetName = levelJson['tileset'];

        let columns:number = levelJson['columns'];
        let rows:number = levelJson['rows'];

        let tilesData:number[] = levelJson['tiles'];
        let tiles:Tile[] = [];

        for (let i = 0; i < tilesData.length; i++) {
            let tileId:number = tilesData[i] - 1;

            let col:number = i % columns;
            let row:number = Math.floor(i / columns);
            let x:number = col * TILE_WIDTH;
            let y:number = row * TILE_HEIGHT;
            let width:number = TILE_WIDTH;
            let height:number = TILE_HEIGHT;
            let sprite:Phaser.GameObjects.Sprite = null;
            let tiletype:TileTypes = TileTypes.Empty;

            if (tileId >= 0) {
                sprite = this.scene.add.sprite(x, y, tilesetName, tileId);
                sprite.setOrigin(0, 0);

                tiletype = this.getTileType(levelJson, tileId);

                if (tiletype != TileTypes.Empty) {
                    let hitboxData = levelJson['customHitboxes'][tileId.toString()];
                    if (hitboxData) {
                        height = hitboxData['height'];
                    }
                }
            }

            tiles.push(new Tile(sprite, x, y, width, height, row, col, tiletype));
        }
        
        return new Tilemap(tiles, columns, rows);
    }

    private getTileType(levelJson: any, tileId: number):TileTypes {
        switch(true) {
            case levelJson['solidTiles'].indexOf(tileId) >= 0:
                return TileTypes.Solid;

            case levelJson['semisolidTiles'].indexOf(tileId) >= 0:
                return TileTypes.Semisolid;

            case levelJson['onoff']['switch_a'].indexOf(tileId) >= 0:
            case levelJson['onoff']['switch_b'].indexOf(tileId) >= 0:
                return TileTypes.OnOffSwitch;

            case levelJson['onoff']['block_a'].indexOf(tileId) >= 0:
                return TileTypes.OnOffBlockA;
            case levelJson['onoff']['block_b'].indexOf(tileId) >= 0:
                return TileTypes.OnOffBlockB;

            default:
                return TileTypes.Empty;
        }
    }
}