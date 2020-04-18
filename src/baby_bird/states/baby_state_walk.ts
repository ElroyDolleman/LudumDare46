/// <reference path="baby_state_grounded.ts"/>
class BabyWalkState extends BabyGroundedState
{
    constructor(baby: Baby) {
        super(baby);
    }

    public enter() {
        this.baby.animator.changeAnimation('walk');
        this.baby.speed.x = BabyStats.DefaultWalkSpeed * this.baby.animator.facingDirection;
    }

    public update() {
        if (this.baby.mommy.isCrouching && Phaser.Geom.Rectangle.Overlaps(this.baby.hitbox, this.baby.mommy.hitbox)) {
            this.baby.speed.y -= 128;
            this.baby.changeState(this.baby.airState);
        }
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