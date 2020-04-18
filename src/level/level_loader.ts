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
            let sprite:Phaser.GameObjects.Sprite = null;
            let tiletype:TileTypes = TileTypes.Empty;

            if (tileId >= 0) {
                sprite = this.scene.add.sprite(x, y, tilesetName, tileId);
                sprite.setOrigin(0, 0);

                if (levelJson['solidTiles'].indexOf(tileId) >= 0) {
                    tiletype = TileTypes.Solid;
                }
                else if (levelJson['semisolidTiles'].indexOf(tileId) >= 0) {
                    tiletype = TileTypes.Semisolid;
                }
            }

            tiles.push(new Tile(sprite, x, y, TILE_WIDTH, TILE_HEIGHT, row, col, tiletype));
        }
        
        return new Tilemap(tiles, columns, rows);
    }
}