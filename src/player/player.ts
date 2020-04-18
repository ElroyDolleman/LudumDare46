
/// <reference path="../entities/actor.ts"/>
class Player extends Actor
{
    public currentState: BaseState;
    public idleState: IdleState;
    public runState: RunState;
    public fallState: FallState;
    public jumpState: JumpState;

    public animator: PlayerAnimator;
    private hitboxGraphics: Phaser.GameObjects.Graphics;

    constructor() {
        super(new Phaser.Geom.Rectangle(100, 100, 14, 10));
        this.hitboxGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFF0000, alpha: 0.5 } });

        this.createStates();
        this.changeState(this.idleState);
        this.animator = new PlayerAnimator(this);
    }

    private createStates() {
        this.idleState = new IdleState(this);
        this.runState = new RunState(this);
        this.fallState = new FallState(this);
        this.jumpState = new JumpState(this);
    }

    public update() {
        this.currentState.update();
        this.animator.update();
    }

    public changeState(newState: BaseState) {
        this.currentState = newState;
        this.currentState.enter();
    }

    public onCollisionSolved() {
        this.animator.updatePosition();

        this.drawHitbox();
    }

    public drawHitbox() {
        this.hitboxGraphics.clear();
        this.hitboxGraphics.depth = 10;
        this.hitboxGraphics.fillRectShape(this.hitbox);
    }
}