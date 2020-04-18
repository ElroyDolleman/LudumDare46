/// <reference path="baby_state_grounded.ts"/>
class BabyDeadState extends BabyGroundedState
{
    constructor(baby: Baby) {
        super(baby);
    }

    public enter() {
        this.baby.animator.changeAnimation('dead');
        this.baby.speed.x = 0;
    }

    public update() {
    }

    public onCollisionSolved(result: CollisionResult) {
    }
}