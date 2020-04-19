enum TileTypes {
    Empty,
    Solid,
    Semisolid,
    OnOffSwitch,
    OnOffBlockA,
    OnOffBlockB,
    Spikes
}

class Tile {

    public readonly hitbox: Phaser.Geom.Rectangle;
    public readonly column: number;
    public readonly row: number;
    public readonly sprite: Phaser.GameObjects.Sprite;
    public type:TileTypes;

    private debugGraphics: Phaser.GameObjects.Graphics;
    public switchJustTriggered: boolean = false;

    public spikeDirection: Phaser.Geom.Point;

    public get position():Phaser.Geom.Point { return new Phaser.Geom.Point(this.hitbox.x, this.hitbox.y) }
    
    public get isEmpty():boolean { return this.type == TileTypes.Empty; }
    public get isSolid():boolean { return this.type == TileTypes.Solid || this.type == OnOffState.CurrentOnType; }
    public get isSemisolid():boolean { return this.type == TileTypes.Semisolid; }
    public get canStandOn():boolean { return this.isSolid || this.isSemisolid; }
    public get canDamage():boolean { return this.type == TileTypes.Spikes; }

    public get isOnOffSwitch():boolean { return this.type == TileTypes.OnOffSwitch; }
    public get isOnOffBlock():boolean { return this.type == TileTypes.OnOffBlockA || this.type == TileTypes.OnOffBlockB; }
    public get isEffectedByOnOffState():boolean { return this.isOnOffSwitch || this.isOnOffBlock; }

    constructor(sprite:Phaser.GameObjects.Sprite, x:number, y:number, width:number, height:number, col:number, row:number, type:TileTypes) {
        this.sprite = sprite;
        this.hitbox = new Phaser.Geom.Rectangle(x, y, width, height);
        this.column = col;
        this.row = row;
        this.type = type ? type : TileTypes.Empty;

        if (type == TileTypes.Spikes) {
            this.setupSpikeHitbox(width, height);
        }

        // this.debugGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xfa8900, alpha: 0.5 } });
        // if (this.canStandOn || this.canDamage) {
        //     this.drawHitbox();
        // }

        if (this.isEffectedByOnOffState) {
            OnOffState.StateEvents.addListener('switched', this.onOnOffStateChanged, this);
        }
    }

    public drawHitbox() {
        this.debugGraphics.clear();
        this.debugGraphics.depth = 10;
        this.debugGraphics.fillRectShape(this.hitbox);
    }
    public clearHitbox() {
        this.debugGraphics.clear();
    }

    public triggerSwitch(actor: Actor) {
        if (actor.currentSwitch == null) {
            OnOffState.SwitchState();
            actor.currentSwitch = this;
        }
    }

    private setupSpikeHitbox(width:number, height:number) {
        let degree = Phaser.Math.RadToDeg(this.sprite.rotation);
        switch(degree) {
            case -90: case 270:
                this.hitbox.x += width - 5;
                this.hitbox.width = 5;
                this.spikeDirection = new Phaser.Geom.Point(-1, 0);
                break;
            case 90: case -270:
                this.hitbox.width = 5;
                this.spikeDirection = new Phaser.Geom.Point(1, 0);
                break;
            case 180: case -180:
                this.hitbox.height = 5;
                this.spikeDirection = new Phaser.Geom.Point(0, 1);
                break;
            default:
                this.hitbox.y += height - 5;
                this.hitbox.height = 5;
                this.spikeDirection = new Phaser.Geom.Point(0, -1);
                break;
        }
    }

    private onOnOffStateChanged() {
        if (this.isOnOffSwitch) {
            if (this.sprite.frame.name == (36).toString()) {
                this.sprite.setFrame(37);
            }
            else if (this.sprite.frame.name == (37).toString()) {
                this.sprite.setFrame(36);
            }
        }
        else if (this.isOnOffBlock) {
            if (this.sprite.frame.name == (42).toString()) {
                this.sprite.setFrame(45);
            }
            else if (this.sprite.frame.name == (45).toString()) {
                this.sprite.setFrame(42);
            }
            else if (this.sprite.frame.name == (43).toString()) {
                this.sprite.setFrame(44);
            }
            else if (this.sprite.frame.name == (44).toString()) {
                this.sprite.setFrame(43);
            }
        }
    }
}