class PlaygroundScene extends Phaser.Scene {

    player: Player;
    baby: Baby;
    levelLoader: LevelLoader;
    level: Level;
    inputManager: InputManager;
    prevOnState = OnOffState.CurrentOnType;

    init() {
        this.levelLoader = new LevelLoader(this);
    }

    preload() {
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
        this.load.atlas('effects', 'assets/effects.png', 'assets/effects.json');
        this.load.spritesheet('tileset', 'assets/tileset.png', { frameWidth: TILE_WIDTH, frameHeight: TILE_HEIGHT });
        this.levelLoader.preloadJsonFiles();
    }

    create() {
        Scenes.Current = this;

        this.inputManager = new InputManager(this);
        this.level = this.levelLoader.load('playground01');

        this.player = new Player();
        this.baby = new Baby(this.player);
        this.player.baby = this.baby;

        this.level.collidableActors.push(this.player);
        this.level.collidableActors.push(this.baby);
    }

    update(time: number, delta: number) {
        this.prevOnState = OnOffState.CurrentOnType;
        this.inputManager.update();

        this.player.update();
        this.baby.update();

        this.level.updateCollision();

        if (this.player.isDead) {
            this.level.removeCollidableActor(this.player);
        }
        if (this.baby.isDead) {
            this.level.removeCollidableActor(this.baby);
        }

        OnOffState.StateJustChanged = this.prevOnState != OnOffState.CurrentOnType;
    }
}