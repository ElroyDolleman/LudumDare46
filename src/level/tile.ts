enum TileTypes {
    Empty,
    Solid,
    Semisolid,
}

class Tile {

    public readonly hitbox: Phaser.Geom.Rectangle;
    public readonly column: number;
    public readonly row: number;
    public readonly sprite: Phaser.GameObjects.Sprite;
    public type:TileTypes;

    public get position():Phaser.Geom.Point { return new Phaser.Geom.Point(this.hitbox.x, this.hitbox.y) }
    
    public get isSolid():boolean { return this.type == TileTypes.Solid; }
    public get isSemisolid():boolean { return this.type == TileTypes.Semisolid; }

    constructor(sprite:Phaser.GameObjects.Sprite, x:number, y:number, width:number, height:number, col:number, row:number, type:TileTypes) {
        this.sprite = sprite;
        this.hitbox = new Phaser.Geom.Rectangle(x, y, width, height);
        this.column = col;
        this.row = row;
        this.type = type ? type : TileTypes.Empty;
    }
}