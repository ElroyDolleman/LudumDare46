/// <reference path="../util/animator.ts"/>
class BabyAnimator extends Animator
{
    constructor(baby: Baby) {
        super(Scenes.Current.add.sprite(0, 0, 'player', PlayerAnimations.Idle.key), baby);
        this.sprite.setOrigin(0.5, 1);
        this.updatePosition();

        this.createAnimation('walk', 'player', 'babybird_walk_', 2, 6);
        this.changeAnimation('walk');
    }

    public update() {
        super.update();
    }

    public updatePosition() {
        let extra = this.sprite.flipX ? 0 : 1;
        this.sprite.setPosition(this.actor.hitbox.centerX - extra, this.actor.hitbox.bottom);
    }
}