/// <reference path="../entities/actor.ts"/>
class Baby extends Actor
{
    public mommy: Player;
    public animator: BabyAnimator;

    private hitboxGraphics: Phaser.GameObjects.Graphics;

    public currentState: BabyBaseState;
    public walkState: BabyWalkState;
    public waitState: BabyWaitState;
    public airState: BabyAirborneState;

    constructor(mommy: Player) {
        super(new Phaser.Geom.Rectangle(16, 152, 5, 5));
        this.mommy = mommy;
        this.hitboxGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFF0000, alpha: 0.5 } });

        this.animator = new BabyAnimator(this);

        this.createStates();
        this.changeState(this.walkState);
    }

    private createStates() {
        this.walkState = new BabyWalkState(this);
        this.waitState = new BabyWaitState(this);
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
    public wait(faceMommy: boolean = false) {
        if (this.currentState == this.waitState) {
            this.waitState.timer = 0;
        }
        else if (this.currentState == this.walkState) {
            this.changeState(this.waitState);
        }
        if (faceMommy && this.currentState == this.waitState) {
            let direction = MathHelper.sign(this.mommy.hitbox.centerX - this.hitbox.centerX);
            this.animator.facingDirection = direction;
        }
    }

    public onCollisionSolved(result: CollisionResult) {
        this.currentState.onCollisionSolved(result);
        this.animator.updatePosition();

        //this.drawHitbox();
    }

    public drawHitbox() {
        this.hitboxGraphics.clear();
        this.hitboxGraphics.depth = 10;
        this.hitboxGraphics.fillRectShape(this.hitbox);
    }

    public getTarget() {
        return this.mommy;
    }
}