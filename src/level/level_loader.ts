const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
const FLIPPED_VERTICALLY_FLAG   = 0x40000000;
const FLIPPED_DIAGONALLY_FLAG   = 0x20000000;

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
            let rotation:number = 0;
            let sprite:Phaser.GameObjects.Sprite = null;
            let tiletype:TileTypes = TileTypes.Empty;

            if (tileId >= FLIPPED_DIAGONALLY_FLAG) {
                rotation = this.getRotation(tileId);
                tileId &= ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG | FLIPPED_DIAGONALLY_FLAG);
            }

            if (tileId >= 0) {
                sprite = this.scene.add.sprite(x + TILE_WIDTH / 2, y + TILE_WIDTH / 2, tilesetName, tileId);
                sprite.setOrigin(0.5, 0.5);
                sprite.setRotation(rotation);

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

            case levelJson['spikes'].indexOf(tileId) >= 0:
                return TileTypes.Spikes;

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

    private getRotation(tileId:number):number {
        let flippedH: boolean = (tileId & FLIPPED_HORIZONTALLY_FLAG) > 0;
        let flippedV: boolean = (tileId & FLIPPED_VERTICALLY_FLAG) > 0;
        let flippedD: boolean = (tileId & FLIPPED_DIAGONALLY_FLAG) > 0;

        if (!flippedH && flippedV && flippedD) {
            return 1.5 * Math.PI; //270
        }
        else if (!flippedH && !flippedV && flippedD) {
            return 0.5 * Math.PI; // 90
        }
        else if (flippedV && !flippedD) {
            return Math.PI;
        }
        console.warn("the tileId is stored as if it has been rotated/flipped, but the code does not recognize it");
        return 0;
    }
}