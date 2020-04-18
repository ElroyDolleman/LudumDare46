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
var PlaygroundScene = /** @class */ (function (_super) {
    __extends(PlaygroundScene, _super);
    function PlaygroundScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlaygroundScene.prototype.init = function () {
        this.levelLoader = new LevelLoader(this);
    };
    PlaygroundScene.prototype.preload = function () {
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
        this.load.spritesheet('tileset', 'assets/tileset.png', { frameWidth: TILE_WIDTH, frameHeight: TILE_HEIGHT });
        this.levelLoader.preloadJsonFiles();
    };
    PlaygroundScene.prototype.create = function () {
        Scenes.Current = this;
        this.inputManager = new InputManager(this);
        this.level = this.levelLoader.load('playground01');
        this.player = new Player();
        this.baby = new Baby();
        this.level.collidableActors.push(this.player);
        this.level.collidableActors.push(this.baby);
    };
    PlaygroundScene.prototype.update = function (time, delta) {
        this.inputManager.update();
        this.player.update();
        this.baby.update();
        this.level.updateCollision();
    };
    return PlaygroundScene;
}(Phaser.Scene));
/// <reference path="scenes/playground_scene.ts"/>
var config = {
    type: Phaser.AUTO,
    width: 320,
    height: 320,
    scaleMode: 3,
    pixelArt: true,
    backgroundColor: '#3CBCFC',
    title: "Ludum Dare 46",
    version: "0.0.1",
    disableContextMenu: true,
    scene: [PlaygroundScene],
};
var game = new Phaser.Game(config);
var Actor = /** @class */ (function () {
    function Actor(hitbox) {
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
    function Baby() {
        var _this = _super.call(this, new Phaser.Geom.Rectangle(16, 152, 5, 5)) || this;
        _this.direction = 1;
        _this.hitboxGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFF0000, alpha: 0.5 } });
        _this.animator = new BabyAnimator(_this);
        _this.createStates();
        _this.changeState(_this.walkState);
        return _this;
    }
    Baby.prototype.createStates = function () {
        this.walkState = new BabyWalkState(this);
        this.airState = new BabyAirborneState(this);
    };
    Baby.prototype.update = function () {
        this.currentState.update();
        this.animator.update();
    };
    Baby.prototype.changeState = function (newState) {
        this.currentState = newState;
        this.currentState.enter();
    };
    Baby.prototype.onCollisionSolved = function (result) {
        this.currentState.onCollisionSolved(result);
        this.animator.updatePosition();
        this.drawHitbox();
    };
    Baby.prototype.drawHitbox = function () {
        this.hitboxGraphics.clear();
        this.hitboxGraphics.depth = 10;
        this.hitboxGraphics.fillRectShape(this.hitbox);
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
        this.sprite.setPosition(this.actor.hitbox.centerX, this.actor.hitbox.bottom);
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
    Animator.prototype.createAnimation = function (key, texture, prefix, length, frameRate) {
        if (frameRate === void 0) { frameRate = 16; }
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
            repeat: -1,
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
    return Animator;
}());
/// <reference path="../util/animator.ts"/>
var BabyAnimator = /** @class */ (function (_super) {
    __extends(BabyAnimator, _super);
    function BabyAnimator(baby) {
        var _this = _super.call(this, Scenes.Current.add.sprite(0, 0, 'player', PlayerAnimations.Idle.key), baby) || this;
        _this.sprite.setOrigin(0.5, 1);
        _this.updatePosition();
        _this.createAnimation('walk', 'player', 'babybird_walk_', 2, 6);
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
    BabyStats.DefaultGravity = 20;
    BabyStats.DefaultMaxFallSpeed = 200;
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
    };
    BabyAirborneState.prototype.update = function () {
        this.updateGravity();
    };
    BabyAirborneState.prototype.onCollisionSolved = function (result) {
        if (result.onBottom) {
            this.baby.speed.y = 0;
            this.baby.changeState(this.baby.walkState);
        }
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
/// <reference path="baby_basestate.ts"/>
var BabyWalkState = /** @class */ (function (_super) {
    __extends(BabyWalkState, _super);
    function BabyWalkState(baby) {
        return _super.call(this, baby) || this;
    }
    BabyWalkState.prototype.enter = function () {
        this.baby.speed.x = BabyStats.DefaultWalkSpeed * this.baby.animator.facingDirection;
    };
    BabyWalkState.prototype.update = function () {
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
    BabyWalkState.prototype.hasGroundUnderneath = function (tiles) {
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
    BabyWalkState.prototype.isStandingOnTile = function (tile) {
        if (tile.hitbox.top == this.baby.hitbox.bottom) {
            return this.baby.hitbox.right > tile.hitbox.left && this.baby.hitbox.left < tile.hitbox.right;
        }
    };
    return BabyWalkState;
}(BabyBaseState));
var Level = /** @class */ (function () {
    function Level(map) {
        this.collisionManager = new CollisionManager(this);
        this.collidableActors = [];
        this.map = map;
    }
    Level.prototype.update = function () {
    };
    Level.prototype.updateCollision = function () {
        var _this = this;
        this.collidableActors.forEach(function (actor) {
            var result = _this.collisionManager.moveActor(actor);
            // this.map.clearHitboxDrawings();
            // for (let i = 0; i < result.tiles.length; i++) {
            //     result.tiles[i].drawHitbox()
            // }
        });
    };
    return Level;
}());
var LevelLoader = /** @class */ (function () {
    function LevelLoader(scene) {
        this.scene = scene;
    }
    LevelLoader.prototype.preloadJsonFiles = function () {
        this.scene.load.json('levels', 'assets/levels.json');
    };
    LevelLoader.prototype.load = function (name) {
        var levelJson = this.scene.cache.json.get('levels')[name];
        var map = this.createTilemap(levelJson);
        return new Level(map);
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
            var sprite = null;
            var tiletype = TileTypes.Empty;
            if (tileId >= 0) {
                sprite = this.scene.add.sprite(x, y, tilesetName, tileId);
                sprite.setOrigin(0, 0);
                if (levelJson['solidTiles'].indexOf(tileId) >= 0) {
                    tiletype = TileTypes.Solid;
                }
                else if (levelJson['semisolidTiles'].indexOf(tileId) >= 0) {
                    tiletype = TileTypes.Semisolid;
                }
            }
            tiles.push(new Tile(sprite, x, y, TILE_WIDTH, TILE_HEIGHT, row, col, tiletype));
        }
        return new Tilemap(tiles, columns, rows);
    };
    return LevelLoader;
}());
var TileTypes;
(function (TileTypes) {
    TileTypes[TileTypes["Empty"] = 0] = "Empty";
    TileTypes[TileTypes["Solid"] = 1] = "Solid";
    TileTypes[TileTypes["Semisolid"] = 2] = "Semisolid";
})(TileTypes || (TileTypes = {}));
var Tile = /** @class */ (function () {
    function Tile(sprite, x, y, width, height, col, row, type) {
        this.sprite = sprite;
        this.hitbox = new Phaser.Geom.Rectangle(x, y, width, height);
        this.column = col;
        this.row = row;
        this.type = type ? type : TileTypes.Empty;
        this.debugGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFFFF00, alpha: 0.5 } });
    }
    Object.defineProperty(Tile.prototype, "position", {
        get: function () { return new Phaser.Geom.Point(this.hitbox.x, this.hitbox.y); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "isSolid", {
        get: function () { return this.type == TileTypes.Solid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "isSemisolid", {
        get: function () { return this.type == TileTypes.Semisolid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "canStandOn", {
        get: function () { return this.isSolid || this.isSemisolid; },
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
    return Tilemap;
}());
/// <reference path="../entities/actor.ts"/>
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, new Phaser.Geom.Rectangle(16, 262, 10, 10)) || this;
        _this.hitboxGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFF0000, alpha: 0.5 } });
        _this.animator = new PlayerAnimator(_this);
        _this.createStates();
        _this.changeState(_this.idleState);
        return _this;
    }
    Player.prototype.createStates = function () {
        this.idleState = new IdleState(this);
        this.runState = new RunState(this);
        this.fallState = new FallState(this);
        this.jumpState = new JumpState(this);
        this.flyState = new FlyState(this);
    };
    Player.prototype.update = function () {
        this.currentState.update();
        this.animator.update();
    };
    Player.prototype.changeState = function (newState) {
        this.currentState = newState;
        this.currentState.enter();
    };
    Player.prototype.onCollisionSolved = function (result) {
        this.currentState.onCollisionSolved(result);
        this.animator.updatePosition();
        //this.drawHitbox();
    };
    Player.prototype.drawHitbox = function () {
        this.hitboxGraphics.clear();
        this.hitboxGraphics.depth = 10;
        this.hitboxGraphics.fillRectShape(this.hitbox);
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
    PlayerAnimations.Run = { key: 'run', isSingleFrame: false };
    PlayerAnimations.Fly = { key: 'fly', isSingleFrame: false };
})(PlayerAnimations || (PlayerAnimations = {}));
var PlayerAnimator = /** @class */ (function (_super) {
    __extends(PlayerAnimator, _super);
    function PlayerAnimator(player) {
        var _this = _super.call(this, Scenes.Current.add.sprite(0, 0, 'player', PlayerAnimations.Idle.key), player) || this;
        _this.sprite.setOrigin(0.5, 1);
        _this.updatePosition();
        _this.createAnimation('run', 'player', 'playerbird_walk_', 3);
        _this.createAnimation('fly', 'player', 'playerbird_fly_', 3);
        return _this;
    }
    PlayerAnimator.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    PlayerAnimator.prototype.changeAnimation = function (animation) {
        _super.prototype.changeAnimation.call(this, animation.key, animation.isSingleFrame);
    };
    return PlayerAnimator;
}(Animator));
var PlayerStats;
(function (PlayerStats) {
    PlayerStats.DefaultJumpPower = 218;
    PlayerStats.DefaultRunAcceleration = 20;
    PlayerStats.DefaultRunSpeed = 110;
    PlayerStats.DefaultGravity = 16;
    PlayerStats.DefaultMaxFallSpeed = 240;
    PlayerStats.FlyPower = 128;
    PlayerStats.FlyingGravity = PlayerStats.DefaultGravity * 0.5;
    PlayerStats.FlyingMaxFallSpeed = PlayerStats.DefaultMaxFallSpeed * 0.5;
})(PlayerStats || (PlayerStats = {}));
var BaseState = /** @class */ (function () {
    function BaseState(player) {
        this.player = player;
    }
    BaseState.prototype.enter = function () {
    };
    BaseState.prototype.update = function () {
    };
    BaseState.prototype.onCollisionSolved = function (result) {
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
            if (Math.abs(this.player.speed.x) < runAcceleration) {
                this.player.speed.x = 0;
            }
            else {
                this.player.speed.x -= runAcceleration * MathHelper.sign(this.player.speed.x);
            }
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
        this.player.speed.y = 0;
        this.player.changeState(this.player.speed.x == 0 ? this.player.idleState : this.player.runState);
    };
    AirborneState.prototype.headbonk = function () {
        this.player.speed.y = 0;
    };
    return AirborneState;
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
    };
    FlyState.prototype.update = function () {
        this.updateMovementControls();
        if (Inputs.Down.isDown) {
            this.player.speed.y = Math.max(this.player.speed.y, -10);
            this.player.changeState(this.player.fallState);
        }
        else if (Inputs.Jump.key.isDown && Inputs.Jump.heldDownFrames <= 1) {
            this.player.speed.y = -PlayerStats.FlyPower;
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
    FlyState.prototype.onCollisionSolved = function (result) {
        _super.prototype.onCollisionSolved.call(this, result);
    };
    return FlyState;
}(AirborneState));
var GroundedState = /** @class */ (function (_super) {
    __extends(GroundedState, _super);
    function GroundedState(player) {
        return _super.call(this, player) || this;
    }
    GroundedState.prototype.enter = function () {
    };
    GroundedState.prototype.update = function () {
        if (Inputs.Jump.key.isDown && Inputs.Jump.heldDownFrames < 3) {
            this.player.speed.y = -PlayerStats.DefaultJumpPower;
            this.player.changeState(this.player.jumpState);
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
    };
    JumpState.prototype.onCollisionSolved = function (result) {
        _super.prototype.onCollisionSolved.call(this, result);
    };
    return JumpState;
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
var CollisionResult = /** @class */ (function () {
    function CollisionResult() {
        this.onTop = false;
        this.onLeft = false;
        this.onRight = false;
        this.onBottom = false;
        this.tiles = [];
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
        var prevBottomPos = actor.hitbox.bottom; // Used for semisold
        if (actor.speed.x != 0) {
            actor.moveHorizontal();
            for (var i = 0; i < tiles.length; i++) {
                if (!tiles[i].isSolid || !Phaser.Geom.Rectangle.Overlaps(tiles[i].hitbox, actor.hitbox)) {
                    continue;
                }
                if (actor.speed.x > 0) {
                    result.onRight = true;
                    actor.hitbox.x = tiles[i].hitbox.x - actor.hitbox.width;
                }
                else {
                    result.onLeft = true;
                    actor.hitbox.x = tiles[i].hitbox.right;
                }
            }
        }
        if (actor.speed.y != 0) {
            actor.moveVertical();
            for (var i = 0; i < tiles.length; i++) {
                if (!tiles[i].canStandOn || !Phaser.Geom.Rectangle.Overlaps(tiles[i].hitbox, actor.hitbox)) {
                    continue;
                }
                if (tiles[i].isSemisolid) {
                    if (this.isFallingThroughSemisolid(tiles[i], prevBottomPos, actor.hitbox.bottom)) {
                        result.onBottom = true;
                        actor.hitbox.y = tiles[i].hitbox.y - actor.hitbox.height;
                    }
                    continue;
                }
                if (actor.speed.y > 0) {
                    result.onBottom = true;
                    actor.hitbox.y = tiles[i].hitbox.y - actor.hitbox.height;
                }
                else {
                    result.onTop = true;
                    actor.hitbox.y = tiles[i].hitbox.bottom;
                }
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
        Inputs.Jump = { key: scene.input.keyboard.addKey('z'), heldDownFrames: 0 };
    }
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
//# sourceMappingURL=game.js.map