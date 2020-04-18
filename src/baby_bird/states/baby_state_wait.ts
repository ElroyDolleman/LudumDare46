class BabyWaitState extends BabyGroundedState
{
    constructor(baby: Baby) {
        super(baby);
    }

    public enter() {
        this.baby.speed.x = 0;
        setTimeout(() => {
            this.baby.changeState(this.baby.walkState);
        }, BabyStats.DefaultWaitingTime);
    }

    public update() {
    }

    public onCollisionSolved(result: CollisionResult) {
        if (!this.hasGroundUnderneath(result.tiles)) {
            this.baby.changeState(this.baby.airState);
        }
    }
}