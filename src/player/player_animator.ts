class PlayerAnimator
{
    private player: Player;
    public sprite: Phaser.GameObjects.Sprite;

    constructor(player: Player) {

        this.player = player;
        this.sprite = CurrentGameScene.add.sprite(100, 100, 'player', 'playerbird_walk_00.png');

        this.createAnimation('run', 'playerbird_walk_', 2);
        this.sprite.play('run');
    }

    public update(time: number, delta: number) {

    }

    private updatePosition() {
        this.sprite.setPosition(0, 0);
    }

    private createAnimation(key: string, prefix: string, length: number, frameRate: number = 16) {
        let frameNames = CurrentGameScene.anims.generateFrameNames('player', { 
            prefix: prefix,
            suffix: '.png',
            end: length,
            zeroPad: 2
        });
        CurrentGameScene.anims.create({
            key: key,
            frames: frameNames,
            frameRate: frameRate,
            repeat: -1,
        });
    }
}