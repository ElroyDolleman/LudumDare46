enum LevelStates {
    Prepare,
    Playing,
    Pause,
    Lost,
    Win,
}

class GameScene extends Phaser.Scene {

    public player: Player;
    public baby: Baby;
    
    public inputManager: InputManager;
    public prevOnState = OnOffState.CurrentOnType;

    public levelLoader: LevelLoader;
    public levelState: LevelStates;
    public level: Level;
    public currentLevelNumber = 1;

    public screenTransition: ScreenTransition;

    public get currentLevelName(): string { return 'level' + ('0' + this.currentLevelNumber).slice(-2); }

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
        this.screenTransition = new ScreenTransition();

        this.inputManager = new InputManager(this);
        this.createLevel(this.currentLevelName);
    }

    createLevel(levelName: string) {
        this.level = this.levelLoader.load(levelName);
        CurrentLevel = this.level;

        this.player = new Player();
        this.baby = new Baby(this.player);
        this.player.baby = this.baby;
        this.player.x = this.level.goalPos.x - this.player.hitbox.width / 2;
        this.player.y = this.level.goalPos.y - this.player.hitbox.height;
        this.player.animator.facingDirection = MathHelper.sign(this.baby.x - this.player.x);
        this.player.animator.updatePosition();
        this.baby.x = this.level.babySpawn.x;
        this.baby.y = this.level.babySpawn.y + 3;
        this.baby.animator.updatePosition();

        this.level.collidableActors.push(this.player);
        this.level.collidableActors.push(this.baby);

        this.levelState = LevelStates.Prepare;

        this.screenTransition.startSecondPhase();

        this.cameras.main.setBackgroundColor(0x3CBCFC);
    }

    update(time: number, delta: number) {
        if (this.levelState == LevelStates.Pause) {
            return;
        }
        if (this.levelState == LevelStates.Prepare) {
            this.screenTransition.update();
            if (this.inputManager.anyKeyDown && this.screenTransition.done) {
                this.levelState = LevelStates.Playing;
            }
            else return;
        }

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
        if (this.player.lost && this.levelState != LevelStates.Lost) {
            this.levelState = LevelStates.Lost;
            this.screenTransition.active = false;
            setTimeout(() => {
                this.screenTransition.active = true;
                this.screenTransition.startFirstPhase();
            }, 1000);
        }
        else if (this.player.hasWon && this.levelState != LevelStates.Win) {
            this.levelState = LevelStates.Win;
            this.screenTransition.active = false;
            setTimeout(() => {
                this.screenTransition.active = true;
                this.screenTransition.startFirstPhase();
            }, 1700);
        }

        if (this.levelState == LevelStates.Win || this.levelState == LevelStates.Lost) {
            this.screenTransition.update();

            if (this.screenTransition.done) {
                if (this.levelState == LevelStates.Win) this.nextLevel();
                else if (this.levelState == LevelStates.Lost) this.reset();
            }
        }
    }

    nextLevel() {
        if (this.currentLevelNumber >= 8) {
            console.log("END OF GAME");
            return;
        }
        this.currentLevelNumber++;
        this.destroy();
        this.createLevel(this.currentLevelName);
    }

    reset() {
        let name = this.level.name;
        this.destroy();
        this.createLevel(name);
    }

    destroy() {
        OnOffState.ForceState(TileTypes.OnOffBlockA);
        OnOffState.StateEvents.removeAllListeners('switched');
        OnOffState.StateJustChanged = false;

        this.player.destroy();
        this.baby.destroy();
        this.level.destroy();
    }
}