class PlaygroundScene extends Phaser.Scene {

    player: Player;
    levelLoader: LevelLoader;    
    level: Level;

    init() {
        this.levelLoader = new LevelLoader(this);
    }

    preload() {
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
        this.load.spritesheet('tileset', 'assets/tileset.png', { frameWidth: TILE_WIDTH, frameHeight: TILE_HEIGHT });
        this.levelLoader.preloadJsonFiles();
    }

    create() {
        Scenes.Current = this;

        this.level = this.levelLoader.load('playground01');
        this.player = new Player();

        this.level.collidableActors.push(this.player);
    }

    update(time: number, delta: number) {
        this.player.update();
        this.level.update();
    }
}