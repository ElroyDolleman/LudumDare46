class BabyAirborneState extends BabyBaseState
{
    constructor(baby: Baby) {
        super(baby);
    }

    public enter() {
        this.baby.animator.changeAnimation('babybird_walk_00.png', true);
    }

    public update() {
        this.updateGravity();
    }

    public onCollisionSolved(result: CollisionResult) {
        if (Phaser.Geom.Rectangle.Overlaps(this.baby.hitbox, this.baby.mommy.bounceHitbox) && this.canBounceOnMommy()) {
            this.mommyBounce();
        }
        else if (result.onBottom) {
            if (this.baby.speed.y >= BabyStats.DeadFallSpeed) {
                this.baby.speed.y = 0;
                this.baby.changeState(this.baby.deadState);
                this.baby.particlePlayer.playDeathFall();
                this.baby.animator.squish(1.5, 0.5, 220);
            }
            else {
                this.baby.animator.squish(1.1, 0.8, 200);
                this.baby.speed.y = 0;
                this.baby.changeState(this.baby.walkState);
            }
        }
    }

    private canBounceOnMommy(): boolean {
        return this.baby.speed.y > 0 && (this.baby.mommy.speed.y >= 0 || this.baby.mommy.isInGroundedState) && !this.baby.mommy.isFlying;
    }

    public mommyBounce() {
        this.baby.speed.y = -BabyStats.MommyBouncePower;
        this.baby.mommy.bounceOnHead();
    }

    public updateGravity(gravity: number = BabyStats.DefaultGravity, maxFallSpeed: number = BabyStats.DefaultMaxFallSpeed) {
        if (this.baby.speed.y < maxFallSpeed) {
            this.baby.speed.y = Math.min(this.baby.speed.y + gravity, maxFallSpeed);
        }
    }
}