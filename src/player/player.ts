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
    public panicState: PanicState;
    public deadState: DeadState;
    public winState: WinState;

    public baby: Baby;
    public animator: PlayerAnimator;
    public poofEffect: Animator;
    public particlePlayer: PlayerParticlePlayer;
    private hitboxGraphics: Phaser.GameObjects.Graphics;

    public get bounceHitbox(): Phaser.Geom.Rectangle { return new Phaser.Geom.Rectangle(this.x - 2, this.y - 1, this.hitbox.width + 4, 5); };
    public get yellArea(): Phaser.Geom.Circle { 
        return new Phaser.Geom.Circle(
            this.hitbox.centerX + (3 * this.animator.facingDirection), 
            this.hitbox.centerY, 
            PlayerStats.YellRadius
        ); 
    };

    public get isCrouching(): boolean { return this.currentState == this.crouchState; };
    public get isDead(): boolean { return this.currentState == this.deadState; };
    public get lost(): boolean { return this.isDead || this.currentState == this.panicState; }
    public get hasWon(): boolean { return this.currentState == this.winState; }
    public get isFlying(): boolean { return this.currentState == this.flyState; };
    public get isInGroundedState(): boolean { return this.currentState.isGrouned; };

    constructor() {
        super(new Phaser.Geom.Rectangle(16, 262, 10, 10));
        this.canTriggerOnOffSwitch = true;

        this.animator = new PlayerAnimator(this);
        this.poofEffect = new Animator(Scenes.Current.add.sprite(0, 0, 'effects', 'poof_00.png'), this);
        this.poofEffect.createAnimation('poof', 'effects', 'poof_', 6, 24, 0);
        this.poofEffect.sprite.setVisible(false);

        this.createStates();
        this.currentState = this.idleState;
        this.currentState.enter();

        this.particlePlayer = new PlayerParticlePlayer(this);

        //this.hitboxGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFF0000, alpha: 0.5 } });
    }

    private createStates() {
        this.idleState = new IdleState(this);
        this.runState = new RunState(this);
        this.fallState = new FallState(this);
        this.jumpState = new JumpState(this);
        this.flyState = new FlyState(this);
        this.yellState = new YellState(this);
        this.crouchState = new CrouchState(this);
        this.panicState = new PanicState(this);
        this.deadState = new DeadState(this);
        this.winState = new WinState(this);
    }

    public update() {
        this.currentState.update();
        this.animator.update();

        if (this.baby.isDead && !this.lost) {
            this.changeState(this.panicState);
        }
        if (this.poofEffect.sprite.visible && !this.poofEffect.sprite.anims.isPlaying) {
            this.poofEffect.sprite.setVisible(false);
        }
        super.update();
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
        if (result.isDamaged) {
            result.isDamaged = false;
            for (let i = 0; i < result.tiles.length; i++) {
                if (!result.tiles[i].canDamage) {
                    continue;
                }
                if (result.tiles[i].spikeDirection.x == 0 || MathHelper.sign(this.speed.x) == 0 || MathHelper.sign(this.speed.x) != result.tiles[i].spikeDirection.x) {
                    if (result.tiles[i].spikeDirection.y == 0 || MathHelper.sign(this.speed.y) == 0 || MathHelper.sign(this.speed.y) != result.tiles[i].spikeDirection.y) {
                        if (result.tiles[i].canDamage && Phaser.Geom.Rectangle.Overlaps(this.hitbox, result.tiles[i].hitbox)) {
                            result.isDamaged = true;
                            break;
                        }
                    }
                }
            }
        }

        if (result.isCrushed || result.isDamaged) {
            this.disappearDie();
            return;
        }
        this.currentState.onCollisionSolved(result);
        this.animator.updatePosition();

        if (this.isTouchingGoal && this.baby.isSafe && !this.lost && !this.hasWon) {
            this.winState.goalTile = this.goalTile;
            this.changeState(this.winState);
        }

        this.drawHitbox();
    }
    
    public decelerate(deceleration: number) {
        if (Math.abs(this.speed.x) < deceleration) {
            this.speed.x = 0;
        }
        else {
            this.speed.x -= deceleration * MathHelper.sign(this.speed.x);
        }
    }

    public disappearDie() {
        this.deadState.hideOnDeath = true;
        this.changeState(this.deadState);
        this.poofEffect.sprite.setVisible(true);
        this.poofEffect.updatePosition();
        this.poofEffect.changeAnimation('poof');
    }

    public drawHitbox() {
        // this.hitboxGraphics.clear();
        // this.hitboxGraphics.depth = 10;
        // this.hitboxGraphics.fillRectShape(this.hitbox);
        // this.hitboxGraphics.fillCircleShape(this.yellArea);
    }

    public destroy() {
        this.animator.destroy();
        this.poofEffect.destroy();
        this.particlePlayer.destroy();
    }
}