/// <reference path="../util/animator.ts"/>
module PlayerAnimations
{
    export let Idle = { key: 'playerbird_walk_00.png', isSingleFrame: true };
    export let Jump = { key: 'playerbird_jump_00.png', isSingleFrame: true };
    export let Fall = { key: 'playerbird_fall_00.png', isSingleFrame: true };
    export let Run = { key: 'run', isSingleFrame: false };
    export let Fly = { key: 'fly', isSingleFrame: false };
    export let Yell = { key: 'yell', isSingleFrame: false };
}

class PlayerAnimator extends Animator
{
    constructor(player: Player) {
        super(Scenes.Current.add.sprite(0, 0, 'player', PlayerAnimations.Idle.key), player);
        this.sprite.setOrigin(0.5, 1);
        this.updatePosition();

        this.createAnimation('run', 'player', 'playerbird_walk_', 3);
        this.createAnimation('fly', 'player', 'playerbird_fly_', 3);
        this.createAnimation('yell', 'player', 'playerbird_yell_', 3, 12, 1);
    }

    public update() {
        super.update();
    }

    public changeAnimation(animation: any) {
        super.changeAnimation(animation.key, animation.isSingleFrame);
    }
}