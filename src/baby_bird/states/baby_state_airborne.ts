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
        if (result.onBottom) {
            this.baby.speed.y = 0;
            this.baby.changeState(this.baby.walkState);
        }
    }

    public updateGravity(gravity: number = BabyStats.DefaultGravity, maxFallSpeed: number = BabyStats.DefaultMaxFallSpeed) {
        if (this.baby.speed.y < maxFallSpeed) {
            this.baby.speed.y = Math.min(this.baby.speed.y + gravity, maxFallSpeed);
        }
    }
}