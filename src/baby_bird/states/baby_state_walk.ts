/// <reference path="baby_state_grounded.ts"/>
class BabyWalkState extends BabyGroundedState
{
    constructor(baby: Baby) {
        super(baby);
    }

    public enter() {
        this.baby.speed.x = BabyStats.DefaultWalkSpeed * this.baby.animator.facingDirection;
    }

    public update() {
    }

    public onCollisionSolved(result: CollisionResult) {
        if (result.onRight) {
            this.baby.speed.x = -BabyStats.DefaultWalkSpeed;
        }
        else if (result.onLeft) {
            this.baby.speed.x = BabyStats.DefaultWalkSpeed;
        }
        if (!this.hasGroundUnderneath(result.tiles)) {
            this.baby.changeState(this.baby.airState);
        }
    }
}