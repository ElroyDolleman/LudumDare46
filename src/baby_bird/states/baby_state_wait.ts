class BabyWaitState extends BabyGroundedState
{
    public waitTime: number;
    public timer: number;

    constructor(baby: Baby) {
        super(baby);
    }

    public enter() {
        this.baby.animator.changeAnimation('babybird_walk_00.png', true);
        this.baby.speed.x = 0;
        this.waitTime = BabyStats.DefaultWaitingTime;
        this.timer = 0;
    }

    public update() {
        this.timer += GameTime.getElapsedMS();
        if (this.timer >= this.waitTime) {
            this.baby.changeState(this.baby.walkState);
        }
    }

    public onCollisionSolved(result: CollisionResult) {
        if (!this.hasGroundUnderneath(result.tiles)) {
            this.baby.changeState(this.baby.airState);
        }
    }
}