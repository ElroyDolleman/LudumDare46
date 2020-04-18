class Baby extends Actor
{
    public animator: BabyAnimator;

    private hitboxGraphics: Phaser.GameObjects.Graphics;

    constructor() {
        super(new Phaser.Geom.Rectangle(242, 152, 5, 5));
        this.hitboxGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFF0000, alpha: 0.5 } });

        this.animator = new BabyAnimator(this);

        this.speed.x = -48;
        this.speed.y = 48;
    }

    public update() {
        this.animator.update();

        this.drawHitbox();
    }

    public onCollisionSolved(result: CollisionResult) {
        this.animator.updatePosition();
    }

    public drawHitbox() {
        this.hitboxGraphics.clear();
        this.hitboxGraphics.depth = 10;
        this.hitboxGraphics.fillRectShape(this.hitbox);
    }
}