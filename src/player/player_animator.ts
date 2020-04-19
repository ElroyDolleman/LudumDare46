/// <reference path="../util/animator.ts"/>
module PlayerAnimations
{
    export let Idle = { key: 'playerbird_walk_00.png', isSingleFrame: true };
    export let Jump = { key: 'playerbird_jump_00.png', isSingleFrame: true };
    export let Fall = { key: 'playerbird_fall_00.png', isSingleFrame: true };
    export let Crouch = { key: 'playerbird_crouch_00.png', isSingleFrame: true };
    
    export let Run = { key: 'run', isSingleFrame: false };
    export let Fly = { key: 'fly', isSingleFrame: false };
    export let Yell = { key: 'yell', isSingleFrame: false };
    export let Panic = { key: 'panic', isSingleFrame: false };
    export let Celebrate = { key: 'celebrate', isSingleFrame: false };
}

class PlayerAnimator extends Animator
{
    private shoutSprite: Phaser.GameObjects.Sprite;
    private shoutTimer: number;

    constructor(player: Player) {
        super(Scenes.Current.add.sprite(0, 0, 'player', PlayerAnimations.Idle.key), player);
        this.sprite.setOrigin(0.5, 1);
        this.updatePosition();

        this.createAnimation('run', 'player', 'playerbird_walk_', 3);
        this.createAnimation('fly', 'player', 'playerbird_fly_', 3);
        this.createAnimation('yell', 'player', 'playerbird_yell_', 4, 12, 1);
        this.createAnimation('panic', 'player', 'playerbird_shocked_', 3, 20);
        this.createAnimation('celebrate', 'player', 'playerbird_celebrate_', 4, 8);

        this.shoutSprite = Scenes.Current.add.sprite(0, 0, 'effects', 'shout_00.png');
        this.shoutSprite.setVisible(false);
        this.shoutSprite.setAlpha(0.5);
    }

    public update() {
        super.update();

        if (this.shoutSprite.visible) {
            this.shoutTimer += GameTime.getElapsedMS();
            if (this.shoutTimer >= 80) {
                this.shoutTimer -= 80;

                this.shoutSprite.y += 4;
                if (this.shoutSprite.y > this.actor.hitbox.centerY + 2) {
                    this.shoutSprite.y = this.actor.hitbox.centerY - 7;
                }
                //this.shoutSprite.setRotation(this.shoutSprite.rotation - 0.1);
            }
            if (this.sprite.anims.currentAnim.key != 'yell' || !this.sprite.anims.isPlaying) {
                this.shoutSprite.setVisible(false);
            }
        }
    }

    public updatePosition() {
        this.sprite.setPosition(this.actor.hitbox.centerX, this.actor.hitbox.bottom);
    }

    public changeAnimation(animation: any) {
        super.changeAnimation(animation.key, animation.isSingleFrame);

        if (animation.key == 'yell') {
            this.shoutSprite.x = (this.facingDirection == 1 ? this.actor.hitbox.right : this.actor.hitbox.left) + (8 * this.facingDirection);
            this.shoutSprite.y = this.actor.hitbox.centerY - 7;
            //this.shoutSprite.setRotation(0.5);
            this.shoutSprite.setFlipX(this.facingDirection == -1);
            this.shoutSprite.setVisible(true);

            this.shoutTimer = 0;
        }
    }

    public destroy() {
        super.destroy();
        this.shoutSprite.destroy();
    }
}