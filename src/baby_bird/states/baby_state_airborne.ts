class BabyAirborneState extends BabyBaseState
{
    constructor(baby: Baby) {
        super(baby);
    }

    public enter() {
    }

    public update() {
        this.updateGravity();
    }

    public onCollisionSolved(result: CollisionResult) {
        if (Phaser.Geom.Rectangle.Overlaps(this.baby.hitbox, this.baby.mommy.bounceHitbox) && this.baby.speed.y > 0) {
            this.mommyBounce();
        }
        else if (result.onBottom) {
            if (this.baby.speed.y >= BabyStats.DeadFallSpeed) {
                console.log("BABY DIED", this.baby.speed.y);

                //TODO: Change to dead state
                this.baby.speed.y = 0;
                this.baby.changeState(this.baby.walkState);
            }
            else {
                console.log("survived", this.baby.speed.y);
                this.baby.speed.y = 0;
                this.baby.changeState(this.baby.walkState);
            }
        }
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