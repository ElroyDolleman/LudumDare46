class PlaygroundScene extends Phaser.Scene {

    public player: Player;
    public baby: Baby;
    public levelLoader: LevelLoader;
    public level: Level;
    public inputManager: InputManager;
    public prevOnState = OnOffState.CurrentOnType;

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
        this.level = this.levelLoader.load('level02');
        CurrentLevel = this.level;

        this.player = new Player();
        this.baby = new Baby(this.player);
        this.player.baby = this.baby;
        this.player.x = this.level.goalPos.x - this.player.hitbox.width / 2;
        this.player.y = this.level.goalPos.y - this.player.hitbox.height;
        this.player.animator.facingDirection = MathHelper.sign(this.baby.x - this.player.x);
        this.baby.x = this.level.babySpawn.x;
        this.baby.y = this.level.babySpawn.y;

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
        else if (this.baby.isSafe) {
            
        }

        OnOffState.StateJustChanged = this.prevOnState != OnOffState.CurrentOnType;
    }
}