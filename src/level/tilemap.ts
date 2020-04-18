class Tilemap {

    private tiles: Tile[];

    readonly columns: number;
    readonly rows: number;

    constructor(tiles:Tile[], columns:number, rows:number) {
        this.tiles = tiles;
        this.columns = columns;
        this.rows = rows;
    }

    public getTile(col:number, row:number):Tile {
       return this.tiles[col + (row * this.columns)];
    }
    public getTilesFromRect(rect: Phaser.Geom.Rectangle, margin: number = 0):Tile[] {
        return this.getTilesFromTo(
            this.toGridLocation(rect.x - margin, rect.y - margin), 
            this.toGridLocation(rect.right + margin, rect.bottom + margin)
        );
    }
    public getTilesFromTo(from: Phaser.Geom.Point, to: Phaser.Geom.Point):Tile[] {
        let tiles = [];
        for (let x = from.x; x <= to.x; x++) {
            for (let y = from.y; y <= to.y; y++) {
                let tile = this.getTile(x, y);
                if (tile) {
                    tiles.push(tile);
                }
            }
        }
        return tiles;
    }
    public worldToTile(x:number, y:number):Tile {
        return this.getTile(this.toColumn(x), this.toRow(y));
    }

    public toColumn(xPos: number):number {
        return Math.floor(xPos / TILE_WIDTH);
    }
    public toRow(yPos: number):number {
        return Math.floor(yPos / TILE_HEIGHT);
    }
    public toGridLocation(x:number, y:number):Phaser.Geom.Point {
        return new Phaser.Geom.Point(
            this.toColumn(x),
            this.toRow(y),
        );
    }
    public toWorldX(column:number):number {
        return column * TILE_WIDTH;
    }
    public toWorldY(row:number):number {
        return row * TILE_HEIGHT;
    }
    public toWorldPosition(col:number, row:number):Phaser.Geom.Point {
        return new Phaser.Geom.Point(
            this.toWorldX(col),
            this.toWorldY(row)
        );
    }

    public clearHitboxDrawings() {
        this.tiles.forEach(tile => {
            tile.clearHitbox();
        });
    }
}