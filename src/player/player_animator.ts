module PlayerAnimations
{
    export let Idle = { key: 'playerbird_walk_00.png', isSingleFrame: true };
    export let Jump = { key: 'playerbird_jump_00.png', isSingleFrame: true };
    export let Fall = { key: 'playerbird_fall_00.png', isSingleFrame: true };
    export let Run = { key: 'run', isSingleFrame: false };
    export let Fly = { key: 'fly', isSingleFrame: false };
}

class PlayerAnimator
{
    private player: Player;
    public sprite: Phaser.GameObjects.Sprite;

    public get facingDirection(): number { return this.sprite.flipX ? -1 : 1; }
    public set facingDirection(dir: number) { this.sprite.flipX = dir < 0; }
    public get frameRate(): number { return this.sprite.anims.frameRate; }
    public set frameRate(value: number) { this.sprite.anims.frameRate = value; }

    private currentSquish: { timer: number, startTime: number, reverseTime: number, scaleX: number, scaleY: number } = { timer: 0, startTime: 0, reverseTime: 0, scaleX: 1, scaleY: 1 };
    public get isSquishing(): boolean { return this.currentSquish.timer > 0; }

    constructor(player: Player) {

        this.player = player;
        this.sprite = Scenes.Current.add.sprite(0, 0, 'player', PlayerAnimations.Idle.key);
        this.sprite.setOrigin(0.5, 1);
        this.updatePosition();

        this.createAnimation('run', 'playerbird_walk_', 2);
        this.createAnimation('fly', 'playerbird_fly_', 2);
    }

    public update() {
        if (this.player.speed.x > 0) {
            this.sprite.flipX = false;
        }
        else if (this.player.speed.x < 0) {
            this.sprite.flipX = true;
        }
        if (this.isSquishing) {
            this.updateSquish();
        }
    }

    public updatePosition() {
        this.sprite.setPosition(this.player.hitbox.centerX, this.player.hitbox.bottom);
    }

    public changeAnimation(animation: any) {
        if (animation.isSingleFrame) {
            this.sprite.anims.stop();
            this.sprite.setFrame(animation.key);
        }
        else {
            this.sprite.play(animation.key);
        }
    }
    private createAnimation(key: string, prefix: string, length: number, frameRate: number = 16) {
        let frameNames = Scenes.Current.anims.generateFrameNames('player', { 
            prefix: prefix,
            suffix: '.png',
            end: length,
            zeroPad: 2
        });
        Scenes.Current.anims.create({
            key: key,
            frames: frameNames,
            frameRate: frameRate,
            repeat: -1,
        });
    }

    public squish(scaleX: number, scaleY: number, duration: number, reverseTime?: number) {
        this.currentSquish = {
            timer: duration,
            reverseTime: reverseTime == undefined ? duration / 2 : reverseTime,
            startTime: duration,
            scaleX: scaleX,
            scaleY: scaleY
        }
    }
    private updateSquish()
    {
        this.currentSquish.timer = Math.max(this.currentSquish.timer - GameTime.getElapsedMS(), 0);
        let timeToReverse = this.currentSquish.startTime - this.currentSquish.reverseTime;

        if (this.currentSquish.timer > timeToReverse) {
            let t = 1 - (this.currentSquish.timer - timeToReverse) / this.currentSquish.reverseTime;

            this.sprite.scaleX = Phaser.Math.Linear(1, this.currentSquish.scaleX, t);
            this.sprite.scaleY = Phaser.Math.Linear(1, this.currentSquish.scaleY, t);
        }
        else {
            let t = 1 - this.currentSquish.timer / timeToReverse;

            this.sprite.scaleX = Phaser.Math.Linear(this.currentSquish.scaleX, 1, t);
            this.sprite.scaleY = Phaser.Math.Linear(this.currentSquish.scaleY, 1, t);
        }
    }
}