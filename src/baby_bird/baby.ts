/// <reference path="../entities/actor.ts"/>
class Baby extends Actor
{
    public mommy: Player;
    public animator: BabyAnimator;
    public poofEffect: Animator;

    private hitboxGraphics: Phaser.GameObjects.Graphics;

    public currentState: BabyBaseState;
    public walkState: BabyWalkState;
    public waitState: BabyWaitState;
    public airState: BabyAirborneState;
    public deadState: BabyDeadState;

    public get isDead(): boolean { return this.currentState == this.deadState; };

    constructor(mommy: Player) {
        super(new Phaser.Geom.Rectangle(16, 283, 5, 5));
        this.mommy = mommy;
        this.canTriggerOnOffSwitch = true;

        this.animator = new BabyAnimator(this);
        this.poofEffect = new Animator(Scenes.Current.add.sprite(0, 0, 'effects', 'poof_00.png'), this);
        this.poofEffect.createAnimation('poof', 'effects', 'poof_', 6, 20, 0);
        this.poofEffect.sprite.setVisible(false);

        this.createStates();
        this.changeState(this.walkState);

        //this.hitboxGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFF0000, alpha: 0.5 } });
    }

    private createStates() {
        this.walkState = new BabyWalkState(this);
        this.waitState = new BabyWaitState(this);
        this.airState = new BabyAirborneState(this);
        this.deadState = new BabyDeadState(this);
    }

    public update() {
        this.currentState.update();
        this.animator.update();

        if (this.poofEffect.sprite.visible && !this.poofEffect.sprite.anims.isPlaying) {
            this.poofEffect.sprite.setVisible(false);
        }
        super.update();
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
        if (result.isCrushed) {
            this.disappearDie();
            return;
        }
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

    public disappearDie() {
        this.deadState.hideBabyOnDeath = true;
        this.changeState(this.deadState);
        this.poofEffect.sprite.setVisible(true);
        this.poofEffect.updatePosition();
        this.poofEffect.changeAnimation('poof');
    }
}