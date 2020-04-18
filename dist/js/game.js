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
        this.level = this.levelLoader.load('playground01');
        this.player = new Player();
        this.level.collidableActors.push(this.player);
    };
    PlaygroundScene.prototype.update = function (time, delta) {
        this.player.update();
        this.level.update();
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
var Level = /** @class */ (function () {
    function Level(map) {
        this.collisionManager = new CollisionManager(this);
        this.collidableActors = [];
        this.map = map;
    }
    Level.prototype.update = function () {
        var _this = this;
        this.collidableActors.forEach(function (actor) {
            _this.collisionManager.moveActor(actor);
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
        return this.getTilesFromTo(this.toGridLocation(rect.x + margin, rect.y + margin), this.toGridLocation(rect.right + margin, rect.bottom + margin));
    };
    Tilemap.prototype.getTilesFromTo = function (from, to) {
        var tiles = [];
        for (var x = from.x; x <= to.x; x++) {
            for (var y = from.y; y <= to.y; y++) {
                tiles.push(this.getTile(x, y));
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
    return Tilemap;
}());
/// <reference path="../entities/actor.ts"/>
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, new Phaser.Geom.Rectangle(107, 107, 14, 10)) || this;
        _this.hitboxGraphics = Scenes.Current.add.graphics({ lineStyle: { width: 0 }, fillStyle: { color: 0xFF0000, alpha: 0.5 } });
        _this.createStates();
        _this.changeState(_this.idleState);
        _this.animator = new PlayerAnimator(_this);
        return _this;
    }
    Player.prototype.createStates = function () {
        this.idleState = new IdleState(this);
        this.runState = new RunState(this);
        this.fallState = new FallState(this);
        this.jumpState = new JumpState(this);
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
        this.animator.updatePosition();
        this.drawHitbox();
    };
    Player.prototype.drawHitbox = function () {
        this.hitboxGraphics.clear();
        this.hitboxGraphics.depth = 10;
        this.hitboxGraphics.fillRectShape(this.hitbox);
    };
    return Player;
}(Actor));
var PlayerAnimator = /** @class */ (function () {
    function PlayerAnimator(player) {
        this.player = player;
        this.sprite = Scenes.Current.add.sprite(0, 0, 'player', 'playerbird_walk_00.png');
        this.sprite.setOrigin(0.5, 1);
        this.updatePosition();
        this.createAnimation('run', 'playerbird_walk_', 2);
        this.sprite.play('run');
    }
    PlayerAnimator.prototype.update = function () {
    };
    PlayerAnimator.prototype.updatePosition = function () {
        this.sprite.setPosition(this.player.hitbox.centerX, this.player.hitbox.bottom);
    };
    PlayerAnimator.prototype.createAnimation = function (key, prefix, length, frameRate) {
        if (frameRate === void 0) { frameRate = 16; }
        var frameNames = Scenes.Current.anims.generateFrameNames('player', {
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
    };
    return PlayerAnimator;
}());
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
    };
    return AirborneState;
}(BaseState));
var FallState = /** @class */ (function (_super) {
    __extends(FallState, _super);
    function FallState(player) {
        return _super.call(this, player) || this;
    }
    FallState.prototype.enter = function () {
    };
    FallState.prototype.update = function () {
    };
    FallState.prototype.onCollisionSolved = function (result) {
    };
    return FallState;
}(AirborneState));
var GroundedState = /** @class */ (function (_super) {
    __extends(GroundedState, _super);
    function GroundedState(player) {
        return _super.call(this, player) || this;
    }
    GroundedState.prototype.enter = function () {
    };
    GroundedState.prototype.update = function () {
    };
    GroundedState.prototype.onCollisionSolved = function (result) {
    };
    return GroundedState;
}(BaseState));
var IdleState = /** @class */ (function (_super) {
    __extends(IdleState, _super);
    function IdleState(player) {
        return _super.call(this, player) || this;
    }
    IdleState.prototype.enter = function () {
        this.player.speed.y = 48;
    };
    IdleState.prototype.update = function () {
    };
    IdleState.prototype.onCollisionSolved = function (result) {
    };
    return IdleState;
}(GroundedState));
var JumpState = /** @class */ (function (_super) {
    __extends(JumpState, _super);
    function JumpState(player) {
        return _super.call(this, player) || this;
    }
    JumpState.prototype.enter = function () {
    };
    JumpState.prototype.update = function () {
    };
    JumpState.prototype.onCollisionSolved = function (result) {
    };
    return JumpState;
}(AirborneState));
var RunState = /** @class */ (function (_super) {
    __extends(RunState, _super);
    function RunState(player) {
        return _super.call(this, player) || this;
    }
    RunState.prototype.enter = function () {
    };
    RunState.prototype.update = function () {
    };
    RunState.prototype.onCollisionSolved = function (result) {
    };
    return RunState;
}(GroundedState));
var CollisionResult = /** @class */ (function () {
    function CollisionResult() {
        this.onTop = false;
        this.onLeft = false;
        this.onRight = false;
        this.onBottom = false;
    }
    return CollisionResult;
}());
var CollisionManager = /** @class */ (function () {
    function CollisionManager(level) {
        this.currentLevel = level;
    }
    CollisionManager.prototype.moveActor = function (actor) {
        var tiles = this.currentLevel.map.getTilesFromRect(actor.hitbox);
        var result = new CollisionResult();
        var previousHitbox = actor.hitbox;
        if (actor.speed.x != 0) {
            actor.moveHorizontal();
            for (var i = 0; i < tiles.length; i++) {
                if (!this.overlapsWithSolidTile(actor, tiles[i])) {
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
                if (!this.overlapsWithSolidTile(actor, tiles[i])) {
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
        actor.onCollisionSolved(result);
        return result;
    };
    CollisionManager.prototype.overlapsWithSolidTile = function (actor, tile) {
        return tile.isSolid && Phaser.Geom.Rectangle.Overlaps(tile.hitbox, actor.hitbox);
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
//# sourceMappingURL=game.js.map