/// <reference path="baby_state_grounded.ts"/>
class BabyDeadState extends BabyGroundedState
{
    public hideBabyOnDeath: boolean = false;

    constructor(baby: Baby) {
        super(baby);
    }

    public enter() {
        if (this.hideBabyOnDeath) {
            this.baby.animator.sprite.setVisible(false);
            this.baby.speed.x = 0;
            this.baby.speed.y = 0;
        }
        else {
            this.baby.animator.changeAnimation('dead');
            this.baby.speed.x = 0;
        }
    }

    public update() {
    }

    public onCollisionSolved(result: CollisionResult) {
    }
}