var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LevelStates;
(function (LevelStates) {
    LevelStates[LevelStates["Prepare"] = 0] = "Prepare";
    LevelStates[LevelStates["Playing"] = 1] = "Playing";
    LevelStates[LevelStates["Pause"] = 2] = "Pause";
    LevelStates[LevelStates["Lost"] = 3] = "Lost";
    LevelStates[LevelStates["Win"] = 4] = "Win";
})(LevelStates || (LevelStates = {}));
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.prevOnState = OnOffState.CurrentOnType;
        _this.currentLevelNumber = 1;
        return _this;
    }
    Object.defineProperty(GameScene.prototype, "currentLevelName", {
        get: function () { return 'level' + ('0' + this.currentLevelNumber).slice(-2); },
        enumerable: true,
        configurable: true
    });
    GameScene.prototype.init = function () {
        this.levelLoader = new LevelLoader(this);
    };
    GameScene.prototype.preload = function () {
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
        this.load.atlas('effects', 'assets/effects.png', 'assets/effects.json');
        this.load.spritesheet('tileset', 'assets/tileset.png', { frameWidth: TILE_WIDTH, frameHeight: TILE_HEIGHT });
        this.levelLoader.preloadJsonFiles();
    };
    GameScene.prototype.create = function () {
        Scenes.Current = this;
        this.screenTransition = new ScreenTransition();
        this.inputManager = new InputManager(this);
        this.createLevel(this.currentLevelName);
    };
    GameScene.prototype.createLevel = function (levelName) {
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
    };
    GameScene.prototype.update = function (time, delta) {
        var _this = this;
        if (this.levelState == LevelStates.Pause) {
            return;
        }
        if (this.levelState == LevelStates.Prepare) {
            this.screenTransition.update();
            if (this.inputManager.anyKeyDown && this.screenTransition.done) {
                this.levelState = LevelStates.Playing;
            }
            else
                return;
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
            setTimeout(function () {
                _this.screenTransition.active = true;
                _this.screenTransition.startFirstPhase();
            }, 1000);
        }
        else if (this.player.hasWon && this.levelState != LevelStates.Win) {
            this.levelState = LevelStates.Win;
            this.screenTransition.active = false;
            setTimeout(function () {
                _this.screenTransition.active = true;
                _this.screenTransition.startFirstPhase();
            }, 1700);
        }
        if (this.levelState == LevelStates.Win || this.levelState == LevelStates.Lost) {
            this.screenTransition.update();
            if (this.screenTransition.done) {
                if (this.levelState == LevelStates.Win)
                    this.nextLevel();
                else if (this.levelState == LevelStates.Lost)
                    this.reset();
            }
        }
    };
    GameScene.prototype.nextLevel = function () {
        if (this.currentLevelNumber >= 8) {
            console.log("END OF GAME");
            return;
        }
        this.currentLevelNumber++;
        this.destroy();
        this.createLevel(this.currentLevelName);
    };
    GameScene.prototype.reset = function () {
        var name = this.level.name;
        this.destroy();
        this.createLevel(name);
    };
    GameScene.prototype.destroy = function () {
        OnOffState.ForceState(TileTypes.OnOffBlockA);
        OnOffState.StateEvents.removeAllListeners('switched');
        OnOffState.StateJustChanged = false;
        this.player.destroy();
        this.baby.destroy();
        this.level.destroy();
    };
    return GameScene;
}(Phaser.Scene));
/// <reference path="scenes/game_scene.ts"/>
var config = {
    type: Phaser.AUTO,
    width: 320,
    height: 320,
    scaleMode: 3,
    pixelArt: true,
    backgroundColor: '#0x0',
    title: "Ludum Dare 46",
    version: "0.1.0",
    disableContextMenu: true,
    scene: [GameScene],
};
var game = new Phaser.Game(config);
var Actor = /** @class */ (function () {
    function Actor(hitbox) {
        this.canTriggerOnOffSwitch = false;
        this.isTouchingGoal = false;
        this.speed = new Phaser.Math.Vector2();
        this.hitbox = hitbox;
    }
    Object.defineProperty(Actor.prototype, "x", {
        get: function () { return this.hitbox.x; },
        set: function (x) { this.hitbox.x = x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "y", {
        get: function () { return this.hitbox.y; },
        set: function (y) { this.hitbox.y = y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "position", {
        get: function () { return new Phaser.Math.Vector2(this.x, this.y); },
        enumerable: true,
        configurable: true
    });
    Actor.prototype.update = function () {
        if (this.canTriggerOnOffSwitch && this.currentSwitch && !Phaser.Geom.Rectangle.Overlaps(this.currentSwitch.hitbox, this.hitbox)) {
            this.currentSwitch = null;
        }
    };
    Actor.prototype.moveHorizontal = function () {
        this.x += this.speed.x * GameTime.getElapsed();
    };
    Actor.prototype.moveVertical = function () {
        this.y += this.speed.y * GameTime.getElapsed();
    };
    Actor.prototype.onCollisionSolved = function (result) {
    };
    Actor.prototype.calculateNextHitbox = function () {
        return new Phaser.Geom.Rectangle(this.x + this.speed.x * GameTime.getElapsed(), this.y + this.speed.y * GameTime.getElapsed(), this.hitbox.width, this.hitbox.height);
    };
    return Actor;
}());
/// <reference path="../entities/actor.ts"/>
var Baby = /** @class */ (function (_super) {
    __extends(Baby, _super);
    function Baby(mommy) {
        var _this = _super.call(this, new Phaser.Geom.Rectangle(16, 283, 5, 5)) || this;
        _this.mommy = mommy;
        _this.canTriggerOnOffSwitch = true;
        _this.animator = new BabyAnimator(_this);
        _this.poofEffect = new Animator(Scenes.Current.add.sprite(0, 0, 'effects', 'poof_00.png'), _this);
        _this.poofEffect.createAnimation('poof', 'effects', 'poof_', 6, 20, 0);
        _this.poofEffect.sprite.setVisible(false);
        _this.createStates();
        _this.changeState(_this.walkState);
        return _this;
        //this.hitboxGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFF0000, alpha: 0.5 } });
    }
    Object.defineProperty(Baby.prototype, "isDead", {
        get: function () { return this.currentState == this.deadState; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Baby.prototype, "isSafe", {
        get: function () { return this.currentState == this.safeState; },
        enumerable: true,
        configurable: true
    });
    ;
    Baby.prototype.createStates = function () {
        this.walkState = new BabyWalkState(this);
        this.waitState = new BabyWaitState(this);
        this.airState = new BabyAirborneState(this);
        this.deadState = new BabyDeadState(this);
        this.safeState = new BabySafeState(this);
    };
    Baby.prototype.update = function () {
        this.currentState.update();
        this.animator.update();
        if (this.poofEffect.sprite.visible && !this.poofEffect.sprite.anims.isPlaying) {
            this.poofEffect.sprite.setVisible(false);
        }
        _super.prototype.update.call(this);
    };
    Baby.prototype.changeState = function (newState) {
        this.currentState = newState;
        this.currentState.enter();
    };
    Baby.prototype.wait = function (faceMommy) {
        if (faceMommy === void 0) { faceMommy = false; }
        if (this.currentState == this.waitState) {
            this.waitState.timer = 0;
        }
        else if (this.currentState == this.walkState) {
            this.changeState(this.waitState);
        }
        if (faceMommy && this.currentState == this.waitState) {
            var direction = MathHelper.sign(this.mommy.hitbox.centerX - this.hitbox.centerX);
            this.animator.facingDirection = direction;
        }
    };
    Baby.prototype.onCollisionSolved = function (result) {
        if (result.isCrushed || result.isDamaged) {
            this.x = result.prevLeft;
            this.y = result.prevTop;
            this.disappearDie();
            return;
        }
        this.currentState.onCollisionSolved(result);
        this.animator.updatePosition();
        if (this.isTouchingGoal && !this.isSafe) {
            this.safeState.goalTile = this.goalTile;
            this.changeState(this.safeState);
        }
        //this.drawHitbox();
    };
    Baby.prototype.drawHitbox = function () {
        this.hitboxGraphics.clear();
        this.hitboxGraphics.depth = 10;
        this.hitboxGraphics.fillRectShape(this.hitbox);
    };
    Baby.prototype.momentumPushUp = function (momentum) {
        this.speed.y = -momentum;
        this.changeState(this.airState);
    };
    Baby.prototype.getTarget = function () {
        return this.mommy;
    };
    Baby.prototype.disappearDie = function () {
        this.deadState.hideBabyOnDeath = true;
        this.changeState(this.deadState);
        this.poofEffect.sprite.setVisible(true);
        this.poofEffect.updatePosition();
        this.poofEffect.changeAnimation('poof');
    };
    Baby.prototype.destroy = function () {
        this.animator.destroy();
        this.poofEffect.destroy();
    };
    return Baby;
}(Actor));
var Animator = /** @class */ (function () {
    function Animator(sprite, actor) {
        this.currentSquish = { timer: 0, startTime: 0, reverseTime: 0, scaleX: 1, scaleY: 1 };
        this.sprite = sprite;
        this.actor = actor;
    }
    Object.defineProperty(Animator.prototype, "facingDirection", {
        get: function () { return this.sprite.flipX ? -1 : 1; },
        set: function (dir) { this.sprite.flipX = dir < 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "isSquishing", {
        get: function () { return this.currentSquish.timer > 0; },
        enumerable: true,
        configurable: true
    });
    Animator.prototype.update = function () {
        if (this.actor.speed.x > 0) {
            this.sprite.flipX = false;
        }
        else if (this.actor.speed.x < 0) {
            this.sprite.flipX = true;
        }
        if (this.isSquishing) {
            this.updateSquish();
        }
    };
    Animator.prototype.updatePosition = function () {
        this.sprite.setPosition(this.actor.hitbox.centerX, this.actor.hitbox.centerY);
    };
    Animator.prototype.changeAnimation = function (key, isSingleFrame) {
        if (isSingleFrame === void 0) { isSingleFrame = false; }
        if (isSingleFrame) {
            this.sprite.anims.stop();
            this.sprite.setFrame(key);
        }
        else {
            this.sprite.play(key);
            this.setTimeScale(1);
        }
    };
    Animator.prototype.setTimeScale = function (timeScale) {
        this.sprite.anims.setTimeScale(timeScale);
    };
    Animator.prototype.createAnimation = function (key, texture, prefix, length, frameRate, repeat) {
        if (frameRate === void 0) { frameRate = 16; }
        if (repeat === void 0) { repeat = -1; }
        var frameNames = Scenes.Current.anims.generateFrameNames(texture, {
            prefix: prefix,
            suffix: '.png',
            end: length - 1,
            zeroPad: 2
        });
        Scenes.Current.anims.create({
            key: key,
            frames: frameNames,
            frameRate: frameRate,
            repeat: repeat,
        });
    };
    Animator.prototype.squish = function (scaleX, scaleY, duration, reverseTime) {
        this.currentSquish = {
            timer: duration,
            reverseTime: reverseTime == undefined ? duration / 2 : reverseTime,
            startTime: duration,
            scaleX: scaleX,
            scaleY: scaleY
        };
    };
    Animator.prototype.updateSquish = function () {
        this.currentSquish.timer = Math.max(this.currentSquish.timer - GameTime.getElapsedMS(), 0);
        var timeToReverse = this.currentSquish.startTime - this.currentSquish.reverseTime;
        if (this.currentSquish.timer > timeToReverse) {
            var t = 1 - (this.currentSquish.timer - timeToReverse) / this.currentSquish.reverseTime;
            this.sprite.scaleX = Phaser.Math.Linear(1, this.currentSquish.scaleX, t);
            this.sprite.scaleY = Phaser.Math.Linear(1, this.currentSquish.scaleY, t);
        }
        else {
            var t = 1 - this.currentSquish.timer / timeToReverse;
            this.sprite.scaleX = Phaser.Math.Linear(this.currentSquish.scaleX, 1, t);
            this.sprite.scaleY = Phaser.Math.Linear(this.currentSquish.scaleY, 1, t);
        }
    };
    Animator.prototype.destroy = function () {
        this.sprite.destroy();
    };
    return Animator;
}());
/// <reference path="../util/animator.ts"/>
var BabyAnimator = /** @class */ (function (_super) {
    __extends(BabyAnimator, _super);
    function BabyAnimator(baby) {
        var _this = _super.call(this, Scenes.Current.add.sprite(0, 0, 'player', 'babybird_walk_00.png'), baby) || this;
        _this.sprite.setOrigin(0.5, 1);
        _this.updatePosition();
        _this.createAnimation('walk', 'player', 'babybird_walk_', 2, 6);
        _this.createAnimation('dead', 'player', 'babybird_die_', 3, 26, 0);
        _this.changeAnimation('walk');
        return _this;
    }
    BabyAnimator.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    BabyAnimator.prototype.updatePosition = function () {
        var extra = this.sprite.flipX ? 0 : 1;
        this.sprite.setPosition(this.actor.hitbox.centerX - extra, this.actor.hitbox.bottom);
    };
    return BabyAnimator;
}(Animator));
var BabyStats;
(function (BabyStats) {
    BabyStats.DefaultWalkSpeed = 32;
    BabyStats.DefaultGravity = 12;
    BabyStats.DefaultMaxFallSpeed = 320;
    BabyStats.DefaultWaitingTime = 100;
    BabyStats.MommyBouncePower = 168;
    BabyStats.DeadFallSpeed = 300;
    BabyStats.JumpInGoalPower = 96;
})(BabyStats || (BabyStats = {}));
var BabyBaseState = /** @class */ (function () {
    function BabyBaseState(baby) {
        this.baby = baby;
    }
    BabyBaseState.prototype.enter = function () {
    };
    BabyBaseState.prototype.update = function () {
    };
    BabyBaseState.prototype.onCollisionSolved = function (result) {
    };
    return BabyBaseState;
}());
var BabyAirborneState = /** @class */ (function (_super) {
    __extends(BabyAirborneState, _super);
    function BabyAirborneState(baby) {
        return _super.call(this, baby) || this;
    }
    BabyAirborneState.prototype.enter = function () {
        this.baby.animator.changeAnimation('babybird_walk_00.png', true);
    };
    BabyAirborneState.prototype.update = function () {
        this.updateGravity();
    };
    BabyAirborneState.prototype.onCollisionSolved = function (result) {
        if (Phaser.Geom.Rectangle.Overlaps(this.baby.hitbox, this.baby.mommy.bounceHitbox) && this.canBounceOnMommy()) {
            this.mommyBounce();
        }
        else if (result.onBottom) {
            if (this.baby.speed.y >= BabyStats.DeadFallSpeed) {
                this.baby.speed.y = 0;
                this.baby.changeState(this.baby.deadState);
            }
            else {
                this.baby.speed.y = 0;
                this.baby.changeState(this.baby.walkState);
            }
        }
    };
    BabyAirborneState.prototype.canBounceOnMommy = function () {
        return this.baby.speed.y > 0 && (this.baby.mommy.speed.y >= 0 || this.baby.mommy.isInGroundedState) && !this.baby.mommy.isFlying;
    };
    BabyAirborneState.prototype.mommyBounce = function () {
        this.baby.speed.y = -BabyStats.MommyBouncePower;
        this.baby.mommy.bounceOnHead();
    };
    BabyAirborneState.prototype.updateGravity = function (gravity, maxFallSpeed) {
        if (gravity === void 0) { gravity = BabyStats.DefaultGravity; }
        if (maxFallSpeed === void 0) { maxFallSpeed = BabyStats.DefaultMaxFallSpeed; }
        if (this.baby.speed.y < maxFallSpeed) {
            this.baby.speed.y = Math.min(this.baby.speed.y + gravity, maxFallSpeed);
        }
    };
    return BabyAirborneState;
}(BabyBaseState));
var BabyGroundedState = /** @class */ (function (_super) {
    __extends(BabyGroundedState, _super);
    function BabyGroundedState(baby) {
        return _super.call(this, baby) || this;
    }
    BabyGroundedState.prototype.enter = function () {
    };
    BabyGroundedState.prototype.update = function () {
    };
    BabyGroundedState.prototype.onCollisionSolved = function (result) {
    };
    BabyGroundedState.prototype.hasGroundUnderneath = function (tiles) {
        for (var i = 0; i < tiles.length; i++) {
            if (!tiles[i].canStandOn) {
                continue;
            }
            if (this.isStandingOnTile(tiles[i])) {
                return true;
            }
        }
        return false;
    };
    BabyGroundedState.prototype.isStandingOnTile = function (tile) {
        if (tile.hitbox.top == this.baby.hitbox.bottom) {
            return this.baby.hitbox.right > tile.hitbox.left && this.baby.hitbox.left < tile.hitbox.right;
        }
    };
    return BabyGroundedState;
}(BabyBaseState));
/// <reference path="baby_state_grounded.ts"/>
var BabyDeadState = /** @class */ (function (_super) {
    __extends(BabyDeadState, _super);
    function BabyDeadState(baby) {
        var _this = _super.call(this, baby) || this;
        _this.hideBabyOnDeath = false;
        return _this;
    }
    BabyDeadState.prototype.enter = function () {
        if (this.hideBabyOnDeath) {
            this.baby.animator.sprite.setVisible(false);
            this.baby.speed.x = 0;
            this.baby.speed.y = 0;
        }
        else {
            this.baby.animator.changeAnimation('dead');
            this.baby.speed.x = 0;
        }
    };
    BabyDeadState.prototype.update = function () {
    };
    BabyDeadState.prototype.onCollisionSolved = function (result) {
    };
    return BabyDeadState;
}(BabyGroundedState));
var BabySafeState = /** @class */ (function (_super) {
    __extends(BabySafeState, _super);
    function BabySafeState(baby) {
        return _super.call(this, baby) || this;
    }
    BabySafeState.prototype.enter = function () {
        this.baby.speed.x = 0;
        this.baby.animator.changeAnimation('babybird_walk_00.png', true);
    };
    BabySafeState.prototype.update = function () {
        if (this.goalTile.hitbox.top < this.baby.hitbox.bottom) {
            this.baby.speed.y = -BabyStats.JumpInGoalPower;
        }
        else if (this.goalTile.hitbox.top > this.baby.hitbox.bottom) {
            this.baby.speed.y += BabyStats.DefaultGravity;
        }
        else if (this.baby.speed.y > 0) {
            this.baby.speed.y = 0;
        }
        if (Phaser.Math.Difference(this.baby.hitbox.centerX, CurrentLevel.goalPos.x) <= BabyStats.DefaultWalkSpeed * GameTime.getElapsed()) {
            this.baby.hitbox.centerX = CurrentLevel.goalPos.x;
            this.baby.speed.x = 0;
        }
        else if (this.baby.hitbox.centerX < CurrentLevel.goalPos.x) {
            this.baby.speed.x = BabyStats.DefaultWalkSpeed;
        }
        else if (this.baby.hitbox.centerX > CurrentLevel.goalPos.x) {
            this.baby.speed.x = -BabyStats.DefaultWalkSpeed;
        }
    };
    BabySafeState.prototype.onCollisionSolved = function (result) {
    };
    return BabySafeState;
}(BabyGroundedState));
var BabyWaitState = /** @class */ (function (_super) {
    __extends(BabyWaitState, _super);
    function BabyWaitState(baby) {
        return _super.call(this, baby) || this;
    }
    BabyWaitState.prototype.enter = function () {
        this.baby.animator.changeAnimation('babybird_walk_00.png', true);
        this.baby.speed.x = 0;
        this.waitTime = BabyStats.DefaultWaitingTime;
        this.timer = 0;
    };
    BabyWaitState.prototype.update = function () {
        this.timer += GameTime.getElapsedMS();
        if (this.timer >= this.waitTime) {
            this.baby.changeState(this.baby.walkState);
        }
    };
    BabyWaitState.prototype.onCollisionSolved = function (result) {
        if (!this.hasGroundUnderneath(result.tiles)) {
            this.baby.changeState(this.baby.airState);
        }
    };
    return BabyWaitState;
}(BabyGroundedState));
/// <reference path="baby_state_grounded.ts"/>
var BabyWalkState = /** @class */ (function (_super) {
    __extends(BabyWalkState, _super);
    function BabyWalkState(baby) {
        return _super.call(this, baby) || this;
    }
    BabyWalkState.prototype.enter = function () {
        this.baby.animator.changeAnimation('walk');
        this.baby.speed.x = BabyStats.DefaultWalkSpeed * this.baby.animator.facingDirection;
    };
    BabyWalkState.prototype.update = function () {
        if (this.baby.mommy.isCrouching && Phaser.Geom.Rectangle.Overlaps(this.baby.hitbox, this.baby.mommy.hitbox)) {
            this.baby.speed.y -= 128;
            this.baby.changeState(this.baby.airState);
        }
    };
    BabyWalkState.prototype.onCollisionSolved = function (result) {
        if (result.onRight) {
            this.baby.speed.x = -BabyStats.DefaultWalkSpeed;
        }
        else if (result.onLeft) {
            this.baby.speed.x = BabyStats.DefaultWalkSpeed;
        }
        if (!this.hasGroundUnderneath(result.tiles)) {
            this.baby.changeState(this.baby.airState);
        }
    };
    return BabyWalkState;
}(BabyGroundedState));
var Level = /** @class */ (function () {
    function Level(map, name, goalPieces, babySpawn) {
        var _this = this;
        this.collisionManager = new CollisionManager(this);
        this.collidableActors = [];
        this.map = map;
        this.name = name;
        this.babySpawn = babySpawn;
        this.goalPieces = [];
        goalPieces.forEach(function (pos) {
            _this.goalPieces.push(_this.map.getTile(pos.x, pos.y));
        });
        var left = Math.min(this.goalPieces[0].hitbox.left, this.goalPieces[1].hitbox.left);
        var right = Math.max(this.goalPieces[0].hitbox.right, this.goalPieces[1].hitbox.right);
        var diff = right - left;
        this.goalPos = new Phaser.Math.Vector2(right - diff / 2, this.goalPieces[0].hitbox.top);
    }
    Level.prototype.update = function () {
    };
    Level.prototype.updateCollision = function () {
        var _this = this;
        this.collidableActors.forEach(function (actor) {
            var result = _this.collisionManager.moveActor(actor);
            for (var i = 0; i < _this.goalPieces.length; i++) {
                if (Phaser.Geom.Rectangle.Overlaps(actor.hitbox, _this.goalPieces[i].hitbox)
                    || (actor.hitbox.bottom == _this.goalPieces[i].hitbox.top && actor.hitbox.right > _this.goalPieces[i].hitbox.left && actor.hitbox.left < _this.goalPieces[i].hitbox.right)) {
                    actor.isTouchingGoal = true;
                    actor.goalTile = _this.goalPieces[i];
                    break;
                }
                else {
                    actor.isTouchingGoal = false;
                    actor.goalTile = null;
                }
            }
            // this.map.clearHitboxDrawings();
            // for (let i = 0; i < result.this.goalPieces[i]s.length; i++) {
            //     result.this.goalPieces[i]s[i].drawHitbox()
            // }
        });
    };
    Level.prototype.removeCollidableActor = function (actor) {
        var index = this.collidableActors.indexOf(actor);
        if (index < 0)
            return;
        this.collidableActors.splice(index, 1);
    };
    Level.prototype.destroy = function () {
        this.map.destroy();
    };
    return Level;
}());
var FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
var FLIPPED_VERTICALLY_FLAG = 0x40000000;
var FLIPPED_DIAGONALLY_FLAG = 0x20000000;
var LevelLoader = /** @class */ (function () {
    function LevelLoader(scene) {
        this.scene = scene;
    }
    LevelLoader.prototype.preloadJsonFiles = function () {
        this.scene.load.json('levels', 'assets/levels.json');
    };
    LevelLoader.prototype.load = function (name) {
        this.goalPieces = [];
        this.babySpawn = new Phaser.Math.Vector2();
        var levelJson = this.scene.cache.json.get('levels')[name];
        var map = this.createTilemap(levelJson);
        return new Level(map, name, this.goalPieces, this.babySpawn);
    };
    LevelLoader.prototype.createTilemap = function (levelJson) {
        var tilesetName = levelJson['tileset'];
        var columns = levelJson['columns'];
        var rows = levelJson['rows'];
        var tilesData = levelJson['tiles'];
        var tiles = [];
        for (var i = 0; i < tilesData.length; i++) {
            var tileId = tilesData[i] - 1;
            var col = i % columns;
            var row = Math.floor(i / columns);
            var x = col * TILE_WIDTH;
            var y = row * TILE_HEIGHT;
            var width = TILE_WIDTH;
            var height = TILE_HEIGHT;
            var rotation = 0;
            var sprite = null;
            var tiletype = TileTypes.Empty;
            if (tileId >= FLIPPED_DIAGONALLY_FLAG) {
                rotation = this.getRotation(tileId);
                tileId &= ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG | FLIPPED_DIAGONALLY_FLAG);
            }
            if (levelJson['babySpawnTileId'] == tileId) {
                this.babySpawn.x = x + width / 2;
                this.babySpawn.y = y + height / 2;
            }
            else if (tileId >= 0) {
                sprite = this.scene.add.sprite(x + TILE_WIDTH / 2, y + TILE_WIDTH / 2, tilesetName, tileId);
                sprite.setOrigin(0.5, 0.5);
                sprite.setRotation(rotation);
                tiletype = this.getTileType(levelJson, tileId);
                if (tiletype != TileTypes.Empty) {
                    if (tiletype == TileTypes.Goal) {
                        this.goalPieces.push(new Phaser.Geom.Point(col, row));
                    }
                    var hitboxData = levelJson['customHitboxes'][tileId.toString()];
                    if (hitboxData) {
                        if (hitboxData['x'])
                            x += hitboxData['x'];
                        if (hitboxData['y'])
                            y += hitboxData['y'];
                        if (hitboxData['width'])
                            width = hitboxData['width'];
                        if (hitboxData['height'])
                            height = hitboxData['height'];
                    }
                }
            }
            tiles.push(new Tile(sprite, x, y, width, height, row, col, tiletype));
        }
        return new Tilemap(tiles, columns, rows);
    };
    LevelLoader.prototype.getTileType = function (levelJson, tileId) {
        switch (true) {
            case levelJson['solidTiles'].indexOf(tileId) >= 0:
                return TileTypes.Solid;
            case levelJson['semisolidTiles'].indexOf(tileId) >= 0:
                return TileTypes.Semisolid;
            case levelJson['spikes'].indexOf(tileId) >= 0:
                return TileTypes.Spikes;
            case levelJson['goal'].indexOf(tileId) >= 0:
                return TileTypes.Goal;
            case levelJson['onoff']['switch_a'].indexOf(tileId) >= 0:
            case levelJson['onoff']['switch_b'].indexOf(tileId) >= 0:
                return TileTypes.OnOffSwitch;
            case levelJson['onoff']['block_a'].indexOf(tileId) >= 0:
                return TileTypes.OnOffBlockA;
            case levelJson['onoff']['block_b'].indexOf(tileId) >= 0:
                return TileTypes.OnOffBlockB;
            default:
                return TileTypes.Empty;
        }
    };
    LevelLoader.prototype.getRotation = function (tileId) {
        var flippedH = (tileId & FLIPPED_HORIZONTALLY_FLAG) > 0;
        var flippedV = (tileId & FLIPPED_VERTICALLY_FLAG) > 0;
        var flippedD = (tileId & FLIPPED_DIAGONALLY_FLAG) > 0;
        if (!flippedH && flippedV && flippedD) {
            return 1.5 * Math.PI; //270
        }
        else if (!flippedH && !flippedV && flippedD) {
            return 0.5 * Math.PI; // 90
        }
        else if (flippedV && !flippedD) {
            return Math.PI;
        }
        console.warn("the tileId is stored as if it has been rotated/flipped, but the code does not recognize it");
        return 0;
    };
    return LevelLoader;
}());
var TileTypes;
(function (TileTypes) {
    TileTypes[TileTypes["Empty"] = 0] = "Empty";
    TileTypes[TileTypes["Solid"] = 1] = "Solid";
    TileTypes[TileTypes["Semisolid"] = 2] = "Semisolid";
    TileTypes[TileTypes["OnOffSwitch"] = 3] = "OnOffSwitch";
    TileTypes[TileTypes["OnOffBlockA"] = 4] = "OnOffBlockA";
    TileTypes[TileTypes["OnOffBlockB"] = 5] = "OnOffBlockB";
    TileTypes[TileTypes["Spikes"] = 6] = "Spikes";
    TileTypes[TileTypes["Goal"] = 7] = "Goal";
})(TileTypes || (TileTypes = {}));
var Tile = /** @class */ (function () {
    function Tile(sprite, x, y, width, height, col, row, type) {
        this.switchJustTriggered = false;
        this.cannotTriggerSwitch = false;
        this.sprite = sprite;
        this.hitbox = new Phaser.Geom.Rectangle(x, y, width, height);
        this.column = col;
        this.row = row;
        this.type = type ? type : TileTypes.Empty;
        if (type == TileTypes.Spikes) {
            this.setupSpikeHitbox(width, height);
        }
        // this.debugGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xfa8900, alpha: 0.5 } });
        // if (this.isSemisolid || this.canDamage) {
        //      this.drawHitbox();
        // }
        if (this.isEffectedByOnOffState) {
            OnOffState.StateEvents.addListener('switched', this.onOnOffStateChanged, this);
        }
    }
    Object.defineProperty(Tile.prototype, "position", {
        get: function () { return new Phaser.Geom.Point(this.hitbox.x, this.hitbox.y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "isEmpty", {
        get: function () { return this.type == TileTypes.Empty; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "isSolid", {
        get: function () { return this.type == TileTypes.Solid || this.type == OnOffState.CurrentOnType; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "isSemisolid", {
        get: function () { return this.type == TileTypes.Semisolid || this.type == TileTypes.Goal; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "canStandOn", {
        get: function () { return this.isSolid || this.isSemisolid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "canDamage", {
        get: function () { return this.type == TileTypes.Spikes; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "isOnOffSwitch", {
        get: function () { return this.type == TileTypes.OnOffSwitch; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "isOnOffBlock", {
        get: function () { return this.type == TileTypes.OnOffBlockA || this.type == TileTypes.OnOffBlockB; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "isEffectedByOnOffState", {
        get: function () { return this.isOnOffSwitch || this.isOnOffBlock; },
        enumerable: true,
        configurable: true
    });
    Tile.prototype.drawHitbox = function () {
        this.debugGraphics.clear();
        this.debugGraphics.depth = 10;
        this.debugGraphics.fillRectShape(this.hitbox);
    };
    Tile.prototype.clearHitbox = function () {
        this.debugGraphics.clear();
    };
    Tile.prototype.triggerSwitch = function (actor) {
        var _this = this;
        if (actor.currentSwitch == null) {
            actor.currentSwitch = this;
            if (!this.cannotTriggerSwitch) {
                OnOffState.SwitchState();
                this.cannotTriggerSwitch = true;
                setTimeout(function () {
                    if (_this)
                        _this.cannotTriggerSwitch = false;
                }, 666);
            }
        }
    };
    Tile.prototype.setupSpikeHitbox = function (width, height) {
        var degree = Phaser.Math.RadToDeg(this.sprite.rotation);
        switch (degree) {
            case -90:
            case 270:
                this.hitbox.x += width - 5;
                this.hitbox.width = 5;
                this.spikeDirection = new Phaser.Geom.Point(-1, 0);
                break;
            case 90:
            case -270:
                this.hitbox.width = 5;
                this.spikeDirection = new Phaser.Geom.Point(1, 0);
                break;
            case 180:
            case -180:
                this.hitbox.height = 5;
                this.spikeDirection = new Phaser.Geom.Point(0, 1);
                break;
            default:
                this.hitbox.y += height - 5;
                this.hitbox.height = 5;
                this.spikeDirection = new Phaser.Geom.Point(0, -1);
                break;
        }
    };
    Tile.prototype.onOnOffStateChanged = function () {
        if (this.isOnOffSwitch) {
            if (this.sprite.frame.name == (36).toString()) {
                this.sprite.setFrame(37);
            }
            else if (this.sprite.frame.name == (37).toString()) {
                this.sprite.setFrame(36);
            }
        }
        else if (this.isOnOffBlock) {
            if (this.sprite.frame.name == (42).toString()) {
                this.sprite.setFrame(45);
            }
            else if (this.sprite.frame.name == (45).toString()) {
                this.sprite.setFrame(42);
            }
            else if (this.sprite.frame.name == (43).toString()) {
                this.sprite.setFrame(44);
            }
            else if (this.sprite.frame.name == (44).toString()) {
                this.sprite.setFrame(43);
            }
        }
    };
    Tile.prototype.destroy = function () {
        if (this.sprite) {
            this.sprite.destroy();
        }
    };
    return Tile;
}());
var Tilemap = /** @class */ (function () {
    function Tilemap(tiles, columns, rows) {
        this.tiles = tiles;
        this.columns = columns;
        this.rows = rows;
    }
    Tilemap.prototype.getTile = function (col, row) {
        return this.tiles[col + (row * this.columns)];
    };
    Tilemap.prototype.getTilesFromRect = function (rect, margin) {
        if (margin === void 0) { margin = 0; }
        return this.getTilesFromTo(this.toGridLocation(rect.x - margin, rect.y - margin), this.toGridLocation(rect.right + margin, rect.bottom + margin));
    };
    Tilemap.prototype.getTilesFromTo = function (from, to) {
        var tiles = [];
        for (var x = from.x; x <= to.x; x++) {
            for (var y = from.y; y <= to.y; y++) {
                var tile = this.getTile(x, y);
                if (tile) {
                    tiles.push(tile);
                }
            }
        }
        return tiles;
    };
    Tilemap.prototype.getTileNextTo = function (tile, x, y) {
        return this.getTile(tile.column + x, tile.row + y);
    };
    Tilemap.prototype.worldToTile = function (x, y) {
        return this.getTile(this.toColumn(x), this.toRow(y));
    };
    Tilemap.prototype.toColumn = function (xPos) {
        return Math.floor(xPos / TILE_WIDTH);
    };
    Tilemap.prototype.toRow = function (yPos) {
        return Math.floor(yPos / TILE_HEIGHT);
    };
    Tilemap.prototype.toGridLocation = function (x, y) {
        return new Phaser.Geom.Point(this.toColumn(x), this.toRow(y));
    };
    Tilemap.prototype.toWorldX = function (column) {
        return column * TILE_WIDTH;
    };
    Tilemap.prototype.toWorldY = function (row) {
        return row * TILE_HEIGHT;
    };
    Tilemap.prototype.toWorldPosition = function (col, row) {
        return new Phaser.Geom.Point(this.toWorldX(col), this.toWorldY(row));
    };
    Tilemap.prototype.clearHitboxDrawings = function () {
        this.tiles.forEach(function (tile) {
            tile.clearHitbox();
        });
    };
    Tilemap.prototype.destroy = function () {
        while (this.tiles.length > 0) {
            this.tiles[0].destroy();
            this.tiles.splice(0, 1);
        }
    };
    return Tilemap;
}());
/// <reference path="../entities/actor.ts"/>
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, new Phaser.Geom.Rectangle(16, 262, 10, 10)) || this;
        _this.canTriggerOnOffSwitch = true;
        _this.animator = new PlayerAnimator(_this);
        _this.poofEffect = new Animator(Scenes.Current.add.sprite(0, 0, 'effects', 'poof_00.png'), _this);
        _this.poofEffect.createAnimation('poof', 'effects', 'poof_', 6, 20, 0);
        _this.poofEffect.sprite.setVisible(false);
        _this.createStates();
        _this.currentState = _this.idleState;
        _this.currentState.enter();
        _this.particlePlayer = new PlayerParticlePlayer(_this);
        return _this;
        //this.hitboxGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFF0000, alpha: 0.5 } });
    }
    Object.defineProperty(Player.prototype, "bounceHitbox", {
        get: function () { return new Phaser.Geom.Rectangle(this.x - 2, this.y - 1, this.hitbox.width + 4, 5); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Player.prototype, "yellArea", {
        get: function () {
            return new Phaser.Geom.Circle(this.hitbox.centerX + (3 * this.animator.facingDirection), this.hitbox.centerY, PlayerStats.YellRadius);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Player.prototype, "isCrouching", {
        get: function () { return this.currentState == this.crouchState; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Player.prototype, "isDead", {
        get: function () { return this.currentState == this.deadState; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Player.prototype, "lost", {
        get: function () { return this.isDead || this.currentState == this.panicState; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "hasWon", {
        get: function () { return this.currentState == this.winState; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "isFlying", {
        get: function () { return this.currentState == this.flyState; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Player.prototype, "isInGroundedState", {
        get: function () { return this.currentState.isGrouned; },
        enumerable: true,
        configurable: true
    });
    ;
    Player.prototype.createStates = function () {
        this.idleState = new IdleState(this);
        this.runState = new RunState(this);
        this.fallState = new FallState(this);
        this.jumpState = new JumpState(this);
        this.flyState = new FlyState(this);
        this.yellState = new YellState(this);
        this.crouchState = new CrouchState(this);
        this.panicState = new PanicState(this);
        this.deadState = new DeadState(this);
        this.winState = new WinState(this);
    };
    Player.prototype.update = function () {
        this.currentState.update();
        this.animator.update();
        if (this.baby.isDead && !this.lost) {
            this.changeState(this.panicState);
        }
        if (this.poofEffect.sprite.visible && !this.poofEffect.sprite.anims.isPlaying) {
            this.poofEffect.sprite.setVisible(false);
        }
        _super.prototype.update.call(this);
    };
    Player.prototype.changeState = function (newState) {
        this.currentState.leave();
        this.currentState = newState;
        this.currentState.enter();
    };
    Player.prototype.bounceOnHead = function () {
        this.animator.squish(1, 0.75, 300);
    };
    Player.prototype.onCollisionSolved = function (result) {
        if (result.isDamaged) {
            result.isDamaged = false;
            for (var i = 0; i < result.tiles.length; i++) {
                if (!result.tiles[i].canDamage) {
                    continue;
                }
                if (result.tiles[i].spikeDirection.x == 0 || MathHelper.sign(this.speed.x) == 0 || MathHelper.sign(this.speed.x) != result.tiles[i].spikeDirection.x) {
                    if (result.tiles[i].spikeDirection.y == 0 || MathHelper.sign(this.speed.y) == 0 || MathHelper.sign(this.speed.y) != result.tiles[i].spikeDirection.y) {
                        if (result.tiles[i].canDamage && Phaser.Geom.Rectangle.Overlaps(this.hitbox, result.tiles[i].hitbox)) {
                            result.isDamaged = true;
                            break;
                        }
                    }
                }
            }
        }
        if (result.isCrushed || result.isDamaged) {
            this.disappearDie();
            return;
        }
        this.currentState.onCollisionSolved(result);
        this.animator.updatePosition();
        if (this.isTouchingGoal && this.baby.isSafe && !this.lost && !this.hasWon) {
            this.winState.goalTile = this.goalTile;
            this.changeState(this.winState);
        }
        this.drawHitbox();
    };
    Player.prototype.decelerate = function (deceleration) {
        if (Math.abs(this.speed.x) < deceleration) {
            this.speed.x = 0;
        }
        else {
            this.speed.x -= deceleration * MathHelper.sign(this.speed.x);
        }
    };
    Player.prototype.disappearDie = function () {
        this.deadState.hideOnDeath = true;
        this.changeState(this.deadState);
        this.poofEffect.sprite.setVisible(true);
        this.poofEffect.updatePosition();
        this.poofEffect.changeAnimation('poof');
    };
    Player.prototype.drawHitbox = function () {
        // this.hitboxGraphics.clear();
        // this.hitboxGraphics.depth = 10;
        // this.hitboxGraphics.fillRectShape(this.hitbox);
        // this.hitboxGraphics.fillCircleShape(this.yellArea);
    };
    Player.prototype.destroy = function () {
        this.animator.destroy();
        this.poofEffect.destroy();
        this.particlePlayer.destroy();
    };
    return Player;
}(Actor));
/// <reference path="../util/animator.ts"/>
var PlayerAnimations;
/// <reference path="../util/animator.ts"/>
(function (PlayerAnimations) {
    PlayerAnimations.Idle = { key: 'playerbird_walk_00.png', isSingleFrame: true };
    PlayerAnimations.Jump = { key: 'playerbird_jump_00.png', isSingleFrame: true };
    PlayerAnimations.Fall = { key: 'playerbird_fall_00.png', isSingleFrame: true };
    PlayerAnimations.Crouch = { key: 'playerbird_crouch_00.png', isSingleFrame: true };
    PlayerAnimations.Run = { key: 'run', isSingleFrame: false };
    PlayerAnimations.Fly = { key: 'fly', isSingleFrame: false };
    PlayerAnimations.Yell = { key: 'yell', isSingleFrame: false };
    PlayerAnimations.Panic = { key: 'panic', isSingleFrame: false };
    PlayerAnimations.Celebrate = { key: 'celebrate', isSingleFrame: false };
})(PlayerAnimations || (PlayerAnimations = {}));
var PlayerAnimator = /** @class */ (function (_super) {
    __extends(PlayerAnimator, _super);
    function PlayerAnimator(player) {
        var _this = _super.call(this, Scenes.Current.add.sprite(0, 0, 'player', PlayerAnimations.Idle.key), player) || this;
        _this.sprite.setOrigin(0.5, 1);
        _this.updatePosition();
        _this.createAnimation('run', 'player', 'playerbird_walk_', 3);
        _this.createAnimation('fly', 'player', 'playerbird_fly_', 3);
        _this.createAnimation('yell', 'player', 'playerbird_yell_', 4, 12, 1);
        _this.createAnimation('panic', 'player', 'playerbird_shocked_', 3, 20);
        _this.createAnimation('celebrate', 'player', 'playerbird_celebrate_', 4, 8);
        return _this;
    }
    PlayerAnimator.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    PlayerAnimator.prototype.updatePosition = function () {
        this.sprite.setPosition(this.actor.hitbox.centerX, this.actor.hitbox.bottom);
    };
    PlayerAnimator.prototype.changeAnimation = function (animation) {
        _super.prototype.changeAnimation.call(this, animation.key, animation.isSingleFrame);
    };
    return PlayerAnimator;
}(Animator));
var PlayerParticlePlayer = /** @class */ (function () {
    function PlayerParticlePlayer(player) {
        this.particles = Scenes.Current.add.particles('effects');
        this.player = player;
        var frameNames = Scenes.Current.anims.generateFrameNames('effects', {
            prefix: 'dust_',
            suffix: '.png',
            end: 5,
            zeroPad: 2
        });
        var frames = [];
        frameNames.forEach(function (e) { frames.push(e.frame.toString()); });
        this.landDustEmitter = this.particles.createEmitter({
            x: 0,
            y: 0,
            lifespan: { min: 300, max: 500 },
            speed: { min: 3, max: 5 },
            angle: 270,
            frequency: -1,
            emitZone: { source: new Phaser.Geom.Rectangle(-5, -3, 5, 1) },
            frame: frames
        });
        this.jumpDustEmitter = this.particles.createEmitter({
            x: 0,
            y: 0,
            lifespan: { min: 200, max: 400 },
            speed: { min: 10, max: 15 },
            angle: 270,
            frequency: -1,
            emitZone: { source: new Phaser.Geom.Rectangle(-5, -3, 5, 1) },
            frame: frames
        });
        this.flyDustEmitter = this.particles.createEmitter({
            x: 0,
            y: 0,
            lifespan: { min: 180, max: 240 },
            speed: { min: 17, max: 22 },
            angle: 270,
            frequency: -1,
            emitZone: { source: new Phaser.Geom.Rectangle(-7, -4, 7, 2) },
            frame: frames
        });
    }
    PlayerParticlePlayer.prototype.playFly = function () {
        this.flyDustEmitter.explode(6, this.player.hitbox.centerX, this.player.hitbox.centerY);
    };
    PlayerParticlePlayer.prototype.playLand = function () {
        this.landDustEmitter.explode(12, this.player.hitbox.centerX, this.player.hitbox.bottom);
    };
    PlayerParticlePlayer.prototype.playJump = function () {
        this.jumpDustEmitter.explode(8, this.player.hitbox.centerX, this.player.hitbox.bottom);
    };
    PlayerParticlePlayer.prototype.destroy = function () {
        this.particles.destroy();
    };
    return PlayerParticlePlayer;
}());
var PlayerStats;
(function (PlayerStats) {
    PlayerStats.DefaultHitboxHeight = 10;
    PlayerStats.DefaultJumpPower = 218;
    PlayerStats.DefaultRunAcceleration = 20;
    PlayerStats.DefaultRunSpeed = 110;
    PlayerStats.DefaultGravity = 16;
    PlayerStats.DefaultMaxFallSpeed = 240;
    PlayerStats.FlyPower = 128;
    PlayerStats.FlyingGravity = PlayerStats.DefaultGravity * 0.5;
    PlayerStats.FlyingMaxFallSpeed = PlayerStats.DefaultMaxFallSpeed * 0.5;
    PlayerStats.YellRadius = 28;
    PlayerStats.CrouchDeceleration = 12;
    PlayerStats.CrouchHitboxHeight = 8;
    PlayerStats.PanicRunSpeed = 60;
    PlayerStats.JumpInGoalPower = 96;
})(PlayerStats || (PlayerStats = {}));
var BaseState = /** @class */ (function () {
    function BaseState(player) {
        this.isGrouned = false;
        this.player = player;
    }
    BaseState.prototype.enter = function () {
    };
    BaseState.prototype.update = function () {
    };
    BaseState.prototype.onCollisionSolved = function (result) {
    };
    BaseState.prototype.leave = function () {
    };
    BaseState.prototype.updateMovementControls = function (maxRunSpeed, runAcceleration) {
        if (maxRunSpeed === void 0) { maxRunSpeed = PlayerStats.DefaultRunSpeed; }
        if (runAcceleration === void 0) { runAcceleration = PlayerStats.DefaultRunAcceleration; }
        if (Inputs.Left.isDown) {
            if (this.player.speed.x > -maxRunSpeed) {
                this.player.speed.x = Math.max(this.player.speed.x - runAcceleration, -maxRunSpeed);
            }
            else if (this.player.speed.x < -maxRunSpeed) {
                this.player.speed.x = Math.min(this.player.speed.x + runAcceleration, -maxRunSpeed);
            }
        }
        else if (Inputs.Right.isDown) {
            if (this.player.speed.x < maxRunSpeed) {
                this.player.speed.x = Math.min(this.player.speed.x + runAcceleration, maxRunSpeed);
            }
            else if (this.player.speed.x > maxRunSpeed) {
                this.player.speed.x = Math.max(this.player.speed.x - runAcceleration, maxRunSpeed);
            }
        }
        else {
            this.player.decelerate(runAcceleration);
        }
    };
    return BaseState;
}());
var AirborneState = /** @class */ (function (_super) {
    __extends(AirborneState, _super);
    function AirborneState(player) {
        return _super.call(this, player) || this;
    }
    AirborneState.prototype.enter = function () {
    };
    AirborneState.prototype.update = function () {
    };
    AirborneState.prototype.onCollisionSolved = function (result) {
        if (result.onBottom) {
            this.land();
        }
        else if (result.onTop) {
            this.headbonk();
        }
        if (result.onLeft || result.onRight) {
            this.player.speed.x = 0;
        }
    };
    AirborneState.prototype.updateGravity = function (gravity, maxFallSpeed) {
        if (gravity === void 0) { gravity = PlayerStats.DefaultGravity; }
        if (maxFallSpeed === void 0) { maxFallSpeed = PlayerStats.DefaultMaxFallSpeed; }
        if (this.player.speed.y < maxFallSpeed) {
            this.player.speed.y = Math.min(this.player.speed.y + gravity, maxFallSpeed);
        }
    };
    AirborneState.prototype.land = function () {
        var landImpact = this.player.speed.y;
        this.player.speed.y = 0;
        this.player.changeState(this.player.speed.x == 0 ? this.player.idleState : this.player.runState);
        if (landImpact == PlayerStats.DefaultMaxFallSpeed) {
            this.player.animator.squish(1.1, 0.8, 240);
            this.player.particlePlayer.playLand();
        }
        else {
            this.player.animator.squish(1, 0.8, 160);
        }
    };
    AirborneState.prototype.headbonk = function () {
        this.player.speed.y = 0;
        this.player.animator.squish(1.1, 0.8, 140);
    };
    return AirborneState;
}(BaseState));
var GroundedState = /** @class */ (function (_super) {
    __extends(GroundedState, _super);
    function GroundedState(player) {
        var _this = _super.call(this, player) || this;
        _this.isGrouned = true;
        return _this;
    }
    GroundedState.prototype.enter = function () {
    };
    GroundedState.prototype.update = function () {
        if (Inputs.Jump.key.isDown && Inputs.Jump.heldDownFrames < 3) {
            this.player.speed.y = -PlayerStats.DefaultJumpPower;
            this.player.changeState(this.player.jumpState);
        }
        else if (Phaser.Input.Keyboard.JustDown(Inputs.Yell)) {
            this.player.speed.x = 0;
            this.player.changeState(this.player.yellState);
        }
        else if (Phaser.Input.Keyboard.JustDown(Inputs.Crouch)) {
            this.player.changeState(this.player.crouchState);
        }
    };
    GroundedState.prototype.onCollisionSolved = function (result) {
        if (!this.hasGroundUnderneath(result.tiles)) {
            this.player.changeState(this.player.fallState);
        }
    };
    GroundedState.prototype.hasGroundUnderneath = function (tiles) {
        for (var i = 0; i < tiles.length; i++) {
            if (!tiles[i].canStandOn) {
                continue;
            }
            if (this.isStandingOnTile(tiles[i])) {
                return true;
            }
        }
        return false;
    };
    GroundedState.prototype.isStandingOnTile = function (tile) {
        if (tile.hitbox.top == this.player.hitbox.bottom) {
            return this.player.hitbox.right > tile.hitbox.left && this.player.hitbox.left < tile.hitbox.right;
        }
    };
    return GroundedState;
}(BaseState));
/// <reference path="state_grounded.ts"/>
var CrouchState = /** @class */ (function (_super) {
    __extends(CrouchState, _super);
    function CrouchState(player) {
        return _super.call(this, player) || this;
    }
    CrouchState.prototype.enter = function () {
        this.player.animator.changeAnimation(PlayerAnimations.Crouch);
        this.player.hitbox.height = PlayerStats.CrouchHitboxHeight;
        this.player.hitbox.y += (PlayerStats.DefaultHitboxHeight - PlayerStats.CrouchHitboxHeight);
    };
    CrouchState.prototype.update = function () {
        if (Inputs.Crouch.isUp) {
            this.player.changeState(this.player.speed.x == 0 ? this.player.idleState : this.player.runState);
        }
        _super.prototype.update.call(this);
        this.player.decelerate(PlayerStats.CrouchDeceleration);
    };
    CrouchState.prototype.onCollisionSolved = function (result) {
        _super.prototype.onCollisionSolved.call(this, result);
    };
    CrouchState.prototype.leave = function () {
        this.player.hitbox.height = PlayerStats.DefaultHitboxHeight;
        this.player.hitbox.y -= (PlayerStats.DefaultHitboxHeight - PlayerStats.CrouchHitboxHeight);
    };
    return CrouchState;
}(GroundedState));
var DeadState = /** @class */ (function (_super) {
    __extends(DeadState, _super);
    function DeadState(player) {
        var _this = _super.call(this, player) || this;
        _this.hideOnDeath = true;
        return _this;
    }
    DeadState.prototype.enter = function () {
        if (this.hideOnDeath) {
            this.player.animator.sprite.setVisible(false);
            this.player.speed.x = 0;
            this.player.speed.y = 0;
        }
        else {
            //TODO: Dead animation
            //this.player.animator.changeAnimation('dead');
            this.player.speed.x = 0;
        }
    };
    DeadState.prototype.update = function () {
    };
    DeadState.prototype.onCollisionSolved = function (result) {
    };
    return DeadState;
}(BaseState));
var FallState = /** @class */ (function (_super) {
    __extends(FallState, _super);
    function FallState(player) {
        return _super.call(this, player) || this;
    }
    FallState.prototype.enter = function () {
        this.player.animator.changeAnimation(PlayerAnimations.Fall);
    };
    FallState.prototype.update = function () {
        this.updateMovementControls();
        if (Inputs.Jump.key.isDown && Inputs.Jump.heldDownFrames <= 1) {
            this.player.changeState(this.player.flyState);
        }
        else {
            this.updateGravity();
        }
    };
    FallState.prototype.onCollisionSolved = function (result) {
        _super.prototype.onCollisionSolved.call(this, result);
    };
    return FallState;
}(AirborneState));
var FlyState = /** @class */ (function (_super) {
    __extends(FlyState, _super);
    function FlyState(player) {
        return _super.call(this, player) || this;
    }
    FlyState.prototype.enter = function () {
        this.player.animator.changeAnimation(PlayerAnimations.Fly);
        this.player.speed.y = -PlayerStats.FlyPower;
        this.playFlap();
    };
    FlyState.prototype.update = function () {
        this.updateMovementControls();
        if (Inputs.Down.isDown) {
            this.player.speed.y = Math.max(this.player.speed.y, -10);
            this.player.changeState(this.player.fallState);
        }
        else if (Inputs.Jump.key.isDown && Inputs.Jump.heldDownFrames <= 1) {
            this.player.speed.y = -PlayerStats.FlyPower;
            this.playFlap();
        }
        else {
            this.updateGravity(PlayerStats.FlyingGravity, PlayerStats.FlyingMaxFallSpeed);
        }
        if (this.player.speed.y < 0) {
            this.player.animator.setTimeScale(1);
        }
        else {
            this.player.animator.setTimeScale(0.5);
        }
    };
    FlyState.prototype.playFlap = function () {
        this.player.particlePlayer.playFly();
        this.player.animator.squish(1.1, 0.85, 100);
    };
    FlyState.prototype.onCollisionSolved = function (result) {
        _super.prototype.onCollisionSolved.call(this, result);
    };
    return FlyState;
}(AirborneState));
var IdleState = /** @class */ (function (_super) {
    __extends(IdleState, _super);
    function IdleState(player) {
        return _super.call(this, player) || this;
    }
    IdleState.prototype.enter = function () {
        this.player.animator.changeAnimation(PlayerAnimations.Idle);
    };
    IdleState.prototype.update = function () {
        this.updateMovementControls();
        if (this.player.speed.x != 0) {
            this.player.changeState(this.player.runState);
        }
        _super.prototype.update.call(this);
    };
    IdleState.prototype.onCollisionSolved = function (result) {
        _super.prototype.onCollisionSolved.call(this, result);
    };
    return IdleState;
}(GroundedState));
var JumpState = /** @class */ (function (_super) {
    __extends(JumpState, _super);
    function JumpState(player) {
        var _this = _super.call(this, player) || this;
        _this.heldDownFramesMax = 30;
        return _this;
    }
    JumpState.prototype.enter = function () {
        this.isHoldingJump = true;
        this.player.animator.changeAnimation(PlayerAnimations.Jump);
        this.player.animator.squish(1.1, 0.8, 220);
        this.player.particlePlayer.playJump();
    };
    JumpState.prototype.update = function () {
        this.updateMovementControls();
        if (this.isHoldingJump && (!Inputs.Jump.key.isDown || this.heldDownFrames > this.heldDownFramesMax)) {
            this.isHoldingJump = false;
        }
        else if (this.isHoldingJump) {
            this.heldDownFrames++;
            this.player.speed.y -= PlayerStats.DefaultGravity - 8;
        }
        else if (Inputs.Jump.key.isDown && Inputs.Jump.heldDownFrames <= 1) {
            this.player.changeState(this.player.flyState);
            return;
        }
        this.updateGravity();
        if (this.player.speed.y >= 0) {
            this.player.changeState(this.player.fallState);
        }
        else if (Phaser.Geom.Rectangle.Overlaps(this.player.baby.hitbox, this.player.bounceHitbox)) {
            this.player.baby.momentumPushUp(-this.player.speed.y + 66);
        }
    };
    JumpState.prototype.onCollisionSolved = function (result) {
        _super.prototype.onCollisionSolved.call(this, result);
    };
    return JumpState;
}(AirborneState));
var PanicState = /** @class */ (function (_super) {
    __extends(PanicState, _super);
    function PanicState(player) {
        return _super.call(this, player) || this;
    }
    PanicState.prototype.enter = function () {
        this.player.animator.changeAnimation(PlayerAnimations.Panic);
        this.player.speed.x = 0;
        var direction = MathHelper.sign(this.player.baby.hitbox.centerX - this.player.hitbox.centerX);
        this.player.animator.facingDirection = direction;
        this.randomlyMoving = true;
    };
    PanicState.prototype.update = function () {
        this.updateGravity();
        if (this.randomlyMoving) {
            this.updatePanicRunning();
        }
    };
    PanicState.prototype.updatePanicRunning = function () {
        var _this = this;
        if (this.player.speed.x == 0) {
            this.player.speed.x = PlayerStats.PanicRunSpeed * (Math.random() > 0.5 ? 1 : -1);
            setTimeout(function () {
                if (_this && _this.player)
                    _this.player.speed.x = 0;
            }, Phaser.Math.Between(100, 300));
        }
    };
    PanicState.prototype.onCollisionSolved = function (result) {
        if (result.onBottom) {
            this.player.speed.y = 0;
        }
        if (result.onRight) {
            this.player.speed.x = -PlayerStats.PanicRunSpeed;
        }
        else if (result.onLeft) {
            this.player.speed.x = PlayerStats.PanicRunSpeed;
        }
    };
    return PanicState;
}(AirborneState));
var RunState = /** @class */ (function (_super) {
    __extends(RunState, _super);
    function RunState(player) {
        return _super.call(this, player) || this;
    }
    RunState.prototype.enter = function () {
        this.player.animator.changeAnimation(PlayerAnimations.Run);
    };
    RunState.prototype.update = function () {
        this.updateMovementControls();
        if (this.player.speed.x == 0) {
            this.player.changeState(this.player.idleState);
        }
        _super.prototype.update.call(this);
    };
    RunState.prototype.onCollisionSolved = function (result) {
        _super.prototype.onCollisionSolved.call(this, result);
    };
    return RunState;
}(GroundedState));
var WinState = /** @class */ (function (_super) {
    __extends(WinState, _super);
    function WinState(player) {
        return _super.call(this, player) || this;
    }
    WinState.prototype.enter = function () {
        this.player.animator.changeAnimation(PlayerAnimations.Idle);
        this.player.speed.x = 0;
        this.done = false;
    };
    WinState.prototype.update = function () {
        if (this.done) {
            return;
        }
        if (this.goalTile.hitbox.top < this.player.hitbox.bottom) {
            this.player.speed.y = -PlayerStats.JumpInGoalPower;
        }
        else if (this.goalTile.hitbox.top > this.player.hitbox.bottom) {
            this.player.speed.y += PlayerStats.DefaultGravity;
        }
        else if (this.player.speed.y > 0) {
            this.player.speed.y = 0;
        }
        if (Phaser.Math.Difference(this.player.hitbox.centerX, CurrentLevel.goalPos.x) <= PlayerStats.DefaultRunSpeed * GameTime.getElapsed()) {
            this.player.hitbox.centerX = CurrentLevel.goalPos.x;
            this.player.speed.x = 0;
        }
        else if (this.player.hitbox.centerX < CurrentLevel.goalPos.x) {
            this.player.speed.x = PlayerStats.DefaultRunSpeed;
        }
        else if (this.player.hitbox.centerX > CurrentLevel.goalPos.x) {
            this.player.speed.x = -PlayerStats.DefaultRunSpeed;
        }
        if (!this.done && this.player.hitbox.centerX == CurrentLevel.goalPos.x && this.goalTile.hitbox.top == this.player.hitbox.bottom) {
            this.player.animator.changeAnimation(PlayerAnimations.Celebrate);
            this.done = true;
        }
    };
    WinState.prototype.onCollisionSolved = function (result) {
    };
    return WinState;
}(GroundedState));
var YellState = /** @class */ (function (_super) {
    __extends(YellState, _super);
    function YellState(player) {
        return _super.call(this, player) || this;
    }
    YellState.prototype.enter = function () {
        this.player.animator.changeAnimation(PlayerAnimations.Yell);
    };
    YellState.prototype.update = function () {
        if (!this.player.animator.sprite.anims.isPlaying) {
            this.player.changeState(this.player.idleState);
        }
        if (Phaser.Geom.Intersects.CircleToRectangle(this.player.yellArea, this.player.baby.hitbox)) {
            this.player.baby.wait(true);
        }
    };
    YellState.prototype.onCollisionSolved = function (result) {
        _super.prototype.onCollisionSolved.call(this, result);
    };
    return YellState;
}(GroundedState));
var CollisionResult = /** @class */ (function () {
    function CollisionResult() {
        this.onTop = false;
        this.onLeft = false;
        this.onRight = false;
        this.onBottom = false;
        this.tiles = [];
        this.prevTop = 0;
        this.prevLeft = 0;
        this.prevRight = 0;
        this.prevBottom = 0;
        this.isCrushed = false;
        this.isDamaged = false;
    }
    return CollisionResult;
}());
var CollisionManager = /** @class */ (function () {
    function CollisionManager(level) {
        this.currentLevel = level;
    }
    CollisionManager.prototype.moveActor = function (actor) {
        var result = new CollisionResult();
        var tiles = this.currentLevel.map.getTilesFromRect(actor.calculateNextHitbox(), 2);
        result.prevTop = actor.hitbox.top;
        result.prevLeft = actor.hitbox.left;
        result.prevRight = actor.hitbox.right;
        result.prevBottom = actor.hitbox.bottom;
        actor.moveHorizontal();
        if (actor.hitbox.x < 0) {
            actor.hitbox.x = 0;
        }
        else if (actor.hitbox.right > 320) {
            actor.hitbox.x = 320 - actor.hitbox.width;
        }
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].isEmpty || !Phaser.Geom.Rectangle.Overlaps(tiles[i].hitbox, actor.hitbox)) {
                continue;
            }
            if (!tiles[i].isSolid) {
                if (tiles[i].canDamage) {
                    result.isDamaged = true;
                    continue;
                }
                else if (actor.canTriggerOnOffSwitch && tiles[i].isOnOffSwitch) {
                    tiles[i].triggerSwitch(actor);
                }
                continue;
            }
            if (tiles[i].isOnOffBlock && OnOffState.StateJustChanged) {
                if (actor.hitbox.left < tiles[i].hitbox.left && !this.currentLevel.map.getTileNextTo(tiles[i], -1, 0).isSolid) {
                    result.onRight = true;
                    actor.hitbox.x = tiles[i].hitbox.x - actor.hitbox.width;
                    continue;
                }
                else if (actor.hitbox.right > tiles[i].hitbox.right && !this.currentLevel.map.getTileNextTo(tiles[i], 1, 0).isSolid) {
                    result.onLeft = true;
                    actor.hitbox.x = tiles[i].hitbox.right;
                    continue;
                }
                else {
                    result.isCrushed = true;
                    continue;
                }
            }
            if (tiles[i].canDamage) {
                result.isDamaged = true;
                continue;
            }
            if (actor.speed.x > 0) {
                result.onRight = true;
                actor.hitbox.x = tiles[i].hitbox.x - actor.hitbox.width;
            }
            else if (actor.speed.x < 0) {
                result.onLeft = true;
                actor.hitbox.x = tiles[i].hitbox.right;
            }
        }
        actor.moveVertical();
        if (actor.hitbox.y < 0) {
            actor.hitbox.y = 0;
        }
        else if (actor.hitbox.bottom > 320) {
            actor.hitbox.y = 320 - actor.hitbox.height;
        }
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].isEmpty || !Phaser.Geom.Rectangle.Overlaps(tiles[i].hitbox, actor.hitbox)) {
                continue;
            }
            if (!tiles[i].canStandOn) {
                if (tiles[i].canDamage) {
                    result.isDamaged = true;
                    continue;
                }
                else if (actor.canTriggerOnOffSwitch && tiles[i].isOnOffSwitch) {
                    tiles[i].triggerSwitch(actor);
                }
                continue;
            }
            if (tiles[i].isSemisolid) {
                if (this.isFallingThroughSemisolid(tiles[i], result.prevBottom, actor.hitbox.bottom)) {
                    result.onBottom = true;
                    actor.hitbox.y = tiles[i].hitbox.y - actor.hitbox.height;
                }
                continue;
            }
            if (tiles[i].isOnOffBlock && OnOffState.StateJustChanged) {
                if (actor.hitbox.top < tiles[i].hitbox.top && !this.currentLevel.map.getTileNextTo(tiles[i], 0, -1).isSolid) {
                    result.onBottom = true;
                    actor.hitbox.y = tiles[i].hitbox.y - actor.hitbox.height;
                    continue;
                }
                else if (actor.hitbox.bottom > tiles[i].hitbox.bottom && !this.currentLevel.map.getTileNextTo(tiles[i], 0, 1).isSolid) {
                    result.onTop = true;
                    actor.hitbox.y = tiles[i].hitbox.bottom;
                    continue;
                }
                else {
                    result.isCrushed = true;
                    continue;
                }
            }
            if (actor.speed.y > 0) {
                result.onBottom = true;
                actor.hitbox.y = tiles[i].hitbox.y - actor.hitbox.height;
            }
            else if (actor.speed.y < 0) {
                result.onTop = true;
                actor.hitbox.y = tiles[i].hitbox.bottom;
            }
        }
        result.tiles = tiles;
        actor.onCollisionSolved(result);
        return result;
    };
    CollisionManager.prototype.isFallingThroughSemisolid = function (semisolidTile, prevBottom, currentBottom) {
        return prevBottom <= semisolidTile.hitbox.top && currentBottom >= semisolidTile.hitbox.top;
    };
    return CollisionManager;
}());
var GameTime;
(function (GameTime) {
    GameTime.fps = 60;
    GameTime.frame = 0;
    function getElapsed() {
        return 1 / this.fps;
    }
    GameTime.getElapsed = getElapsed;
    function getElapsedMS() {
        return 1000 / this.fps;
    }
    GameTime.getElapsedMS = getElapsedMS;
    function getTotalSeconds() {
        return GameTime.frame / 60;
    }
    GameTime.getTotalSeconds = getTotalSeconds;
    function getTotalMinutes() {
        return this.getTotalSeconds() / 60;
    }
    GameTime.getTotalMinutes = getTotalMinutes;
    function getTotalHours() {
        return this.getTotalMinutes() / 60;
    }
    GameTime.getTotalHours = getTotalHours;
    function totalTimeStringFormat() {
        var minutes = String(Math.floor(this.getTotalMinutes()));
        if (minutes.length < 2) {
            minutes = "0" + minutes;
        }
        var secondsPrefix = "";
        var seconds = this.getTotalSeconds();
        if (seconds < 10) {
            secondsPrefix = "0";
        }
        return String(Math.floor(this.getTotalHours())) + ":" + minutes + ":" + secondsPrefix + String(seconds);
    }
    GameTime.totalTimeStringFormat = totalTimeStringFormat;
})(GameTime || (GameTime = {}));
var TILE_WIDTH = 16;
var TILE_HEIGHT = 16;
var CurrentLevel;
var Scenes;
(function (Scenes) {
})(Scenes || (Scenes = {}));
var Inputs;
(function (Inputs) {
})(Inputs || (Inputs = {}));
var InputManager = /** @class */ (function () {
    function InputManager(scene) {
        Inputs.Up = scene.input.keyboard.addKey('up');
        Inputs.Left = scene.input.keyboard.addKey('left');
        Inputs.Down = scene.input.keyboard.addKey('down');
        Inputs.Right = scene.input.keyboard.addKey('right');
        Inputs.Crouch = scene.input.keyboard.addKey('down');
        Inputs.Yell = scene.input.keyboard.addKey('x');
        Inputs.Jump = { key: scene.input.keyboard.addKey('z'), heldDownFrames: 0 };
    }
    Object.defineProperty(InputManager.prototype, "anyKeyDown", {
        get: function () {
            return Inputs.Up.isDown || Inputs.Left.isDown || Inputs.Down.isDown || Inputs.Right.isDown || Inputs.Yell.isDown || Inputs.Crouch.isDown || Inputs.Jump.key.isDown;
        },
        enumerable: true,
        configurable: true
    });
    InputManager.prototype.update = function () {
        if (Inputs.Jump.key.isDown) {
            Inputs.Jump.heldDownFrames++;
        }
        else {
            Inputs.Jump.heldDownFrames = 0;
        }
    };
    return InputManager;
}());
var MathHelper;
(function (MathHelper) {
    /**
     * Returns an integer that indicates the sign of a number.
     */
    function sign(value) {
        return value == 0 ? 0 : value > 0 ? 1 : -1;
    }
    MathHelper.sign = sign;
})(MathHelper || (MathHelper = {}));
var OnOffState;
(function (OnOffState) {
    OnOffState.CurrentOnType = TileTypes.OnOffBlockA;
    OnOffState.CurrentOffType = TileTypes.OnOffBlockB;
    OnOffState.StateEvents = new Phaser.Events.EventEmitter();
    OnOffState.StateJustChanged = false;
    function SwitchState() {
        if (OnOffState.CurrentOnType == TileTypes.OnOffBlockA) {
            OnOffState.CurrentOnType = TileTypes.OnOffBlockB;
            OnOffState.CurrentOffType = TileTypes.OnOffBlockA;
        }
        else {
            OnOffState.CurrentOnType = TileTypes.OnOffBlockA;
            OnOffState.CurrentOffType = TileTypes.OnOffBlockB;
        }
        OnOffState.StateEvents.emit('switched');
    }
    OnOffState.SwitchState = SwitchState;
    function ForceState(state) {
        OnOffState.CurrentOnType = state;
        if (state == TileTypes.OnOffBlockA) {
            OnOffState.CurrentOffType = TileTypes.OnOffBlockB;
        }
        else {
            OnOffState.CurrentOffType = TileTypes.OnOffBlockA;
        }
    }
    OnOffState.ForceState = ForceState;
})(OnOffState || (OnOffState = {}));
var ScreenTransition = /** @class */ (function () {
    function ScreenTransition() {
        this.active = true;
        this.graphics = Scenes.Current.add.graphics({ lineStyle: { width: 2, color: 0x0 }, fillStyle: { color: 0x0, alpha: 1 } });
        this.graphics.depth = 69;
        this.create();
    }
    Object.defineProperty(ScreenTransition.prototype, "done", {
        get: function () { return this.time == 1 && this.active; },
        enumerable: true,
        configurable: true
    });
    ;
    ScreenTransition.prototype.create = function () {
        this.graphics.clear();
        var left1 = -60;
        var left2 = -10;
        var right1 = 380;
        var right2 = 330;
        var points = [{ x: left2, y: 0 }];
        for (var y = 320 / 8; y <= 320; y += 320 / 8) {
            points.push({ x: left1, y: y });
            points.push({ x: left2, y: y });
            left1 -= 10;
            left2 -= 10;
        }
        for (var y = 320; y >= 0; y -= 320 / 8) {
            points.push({ x: right1, y: y });
            points.push({ x: right2, y: y });
            right1 += 10;
            right2 += 10;
        }
        this.graphics.fillPoints(points);
        this.graphics.x = 380;
    };
    ScreenTransition.prototype.startFirstPhase = function () {
        this.graphics.setVisible(true);
        this.time = 0;
        this.graphics.x = 440;
        this.startX = 440;
        this.targetX = 0;
    };
    ScreenTransition.prototype.startSecondPhase = function () {
        this.graphics.setVisible(true);
        this.time = 0;
        this.graphics.x = 0;
        this.startX = 0;
        this.targetX = -440;
    };
    ScreenTransition.prototype.update = function () {
        if (this.time == 1 || !this.active) {
            return;
        }
        this.time = Math.min(1, this.time + GameTime.getElapsed() * 2.5);
        this.graphics.x = Phaser.Math.Linear(this.startX, this.targetX, this.time);
        if (this.time == 1 && this.graphics.x <= -380) {
            this.graphics.setVisible(false);
        }
    };
    return ScreenTransition;
}());
//# sourceMappingURL=game.js.map