class PlaygroundScene extends Phaser.Scene {

    player: Player;

    init() {
    }

    preload() {
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
    }

    create() {
        Scenes.Current = this;

        this.player = new Player();
    }

    update(time: number, delta: number) {
        this.player.update();
        this.player.onCollisionSolved();
    }
}