class Actor
{
    public hitbox: Phaser.Geom.Rectangle;
    public speed: Phaser.Math.Vector2;

    public get x(): number { return this.hitbox.x; }
    public get y(): number { return this.hitbox.y; }
    public set x(x) { this.hitbox.x = x; }
    public set y(y) { this.hitbox.y = y; }
    public get position(): Phaser.Math.Vector2 { return new Phaser.Math.Vector2(this.x, this.y); }

    public canTriggerOnOffSwitch: boolean = false;
    public currentSwitch: Tile;

    constructor(hitbox: Phaser.Geom.Rectangle) {
        this.speed = new Phaser.Math.Vector2();
        this.hitbox = hitbox;
    }

    public update() {
        if (this.canTriggerOnOffSwitch && this.currentSwitch && !Phaser.Geom.Rectangle.Overlaps(this.currentSwitch.hitbox, this.hitbox)) {
            this.currentSwitch = null;
        }
    }

    public moveHorizontal() {
        this.x += this.speed.x * GameTime.getElapsed();
    }
    public moveVertical() {
        this.y += this.speed.y * GameTime.getElapsed();
    }

    public onCollisionSolved(result: CollisionResult) {
    }

    public calculateNextHitbox():Phaser.Geom.Rectangle {
        return new Phaser.Geom.Rectangle(
            this.x + this.speed.x * GameTime.getElapsed(),
            this.y + this.speed.y * GameTime.getElapsed(),
            this.hitbox.width,
            this.hitbox.height
        );
    }
}