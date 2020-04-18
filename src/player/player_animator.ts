class PlayerAnimator
{
    private player: Player;
    public sprite: Phaser.GameObjects.Sprite;

    constructor(player: Player) {

        this.player = player;
        this.sprite = Scenes.Current.add.sprite(0, 0, 'player', 'playerbird_walk_00.png');
        this.sprite.setOrigin(0.5, 1);
        this.updatePosition();

        this.createAnimation('run', 'playerbird_walk_', 2);
        this.sprite.play('run');
    }

    public update() {
    }

    public updatePosition() {
        this.sprite.setPosition(this.player.hitbox.centerX, this.player.hitbox.bottom);
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
}