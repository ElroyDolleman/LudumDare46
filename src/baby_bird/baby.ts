/// <reference path="../entities/actor.ts"/>
class Baby extends Actor
{
    public animator: BabyAnimator;
    public direction: number = 1;

    private hitboxGraphics: Phaser.GameObjects.Graphics;

    public currentState: BabyBaseState;
    public walkState: BabyWalkState;
    public airState: BabyAirborneState;

    constructor() {
        super(new Phaser.Geom.Rectangle(16, 152, 5, 5));
        this.hitboxGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFF0000, alpha: 0.5 } });

        this.animator = new BabyAnimator(this);

        this.createStates();
        this.changeState(this.walkState);
    }

    private createStates() {
        this.walkState = new BabyWalkState(this);
        this.airState = new BabyAirborneState(this);
    }

    public update() {
        this.currentState.update();
        this.animator.update();
    }

    public changeState(newState: BabyBaseState) {
        this.currentState = newState;
        this.currentState.enter();
    }

    public onCollisionSolved(result: CollisionResult) {
        this.currentState.onCollisionSolved(result);
        this.animator.updatePosition();

        this.drawHitbox();
    }

    public drawHitbox() {
        this.hitboxGraphics.clear();
        this.hitboxGraphics.depth = 10;
        this.hitboxGraphics.fillRectShape(this.hitbox);
    }
}