/// <reference path="../entities/actor.ts"/>
class Player extends Actor
{
    public currentState: BaseState;
    public idleState: IdleState;
    public runState: RunState;
    public fallState: FallState;
    public jumpState: JumpState;
    public flyState: FlyState;
    public yellState: YellState;
    public crouchState: CrouchState;

    public baby: Baby;
    public animator: PlayerAnimator;
    private hitboxGraphics: Phaser.GameObjects.Graphics;

    public get bounceHitbox(): Phaser.Geom.Rectangle { return new Phaser.Geom.Rectangle(this.x - 2, this.y - 1, this.hitbox.width + 4, 5); };
    public get yellArea(): Phaser.Geom.Circle { 
        return new Phaser.Geom.Circle(
            this.hitbox.centerX + (18 * this.animator.facingDirection), 
            this.hitbox.centerY, 
            PlayerStats.YellRadius
        ); 
    };

    public get isCrouching(): boolean { return this.currentState == this.crouchState; };

    constructor() {
        super(new Phaser.Geom.Rectangle(16, 262, 10, 10));
        this.hitboxGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFF0000, alpha: 0.5 } });

        this.animator = new PlayerAnimator(this);

        this.createStates();
        this.currentState = this.idleState;
        this.currentState.enter();
    }

    private createStates() {
        this.idleState = new IdleState(this);
        this.runState = new RunState(this);
        this.fallState = new FallState(this);
        this.jumpState = new JumpState(this);
        this.flyState = new FlyState(this);
        this.yellState = new YellState(this);
        this.crouchState = new CrouchState(this);
    }

    public update() {
        this.currentState.update();
        this.animator.update();
    }

    public changeState(newState: BaseState) {
        this.currentState.leave();
        this.currentState = newState;
        this.currentState.enter();
    }
    public bounceOnHead() {
        this.animator.squish(1, 0.75, 300);
    }

    public onCollisionSolved(result: CollisionResult) {
        this.currentState.onCollisionSolved(result);
        this.animator.updatePosition();

        //this.drawHitbox();
    }
    
    public decelerate(deceleration: number) {
        if (Math.abs(this.speed.x) < deceleration) {
            this.speed.x = 0;
        }
        else {
            this.speed.x -= deceleration * MathHelper.sign(this.speed.x);
        }
    }

    public drawHitbox() {
        this.hitboxGraphics.clear();
        this.hitboxGraphics.depth = 10;
        this.hitboxGraphics.fillRectShape(this.hitbox);
    }
}