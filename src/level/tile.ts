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

    private debugGraphics: Phaser.GameObjects.Graphics;

    public get position():Phaser.Geom.Point { return new Phaser.Geom.Point(this.hitbox.x, this.hitbox.y) }
    
    public get isSolid():boolean { return this.type == TileTypes.Solid; }
    public get isSemisolid():boolean { return this.type == TileTypes.Semisolid; }
    public get canStandOn():boolean { return this.isSolid || this.isSemisolid; }

    constructor(sprite:Phaser.GameObjects.Sprite, x:number, y:number, width:number, height:number, col:number, row:number, type:TileTypes) {
        this.sprite = sprite;
        this.hitbox = new Phaser.Geom.Rectangle(x, y, width, height);
        this.column = col;
        this.row = row;
        this.type = type ? type : TileTypes.Empty;

        this.debugGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFFFF00, alpha: 0.5 } });
    }

    public drawHitbox() {
        this.debugGraphics.clear();
        this.debugGraphics.depth = 10;        
        this.debugGraphics.fillRectShape(this.hitbox);
    }
    public clearHitbox() {
        this.debugGraphics.clear();
    }
}