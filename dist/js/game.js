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
    };
    PlaygroundScene.prototype.preload = function () {
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
    };
    PlaygroundScene.prototype.create = function () {
        Scenes.Current = this;
        this.player = new Player();
    };
    PlaygroundScene.prototype.update = function (time, delta) {
        this.player.update();
        this.player.onCollisionSolved();
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
    Actor.prototype.onCollisionSolved = function () {
    };
    Actor.prototype.calculateNextHitbox = function () {
        return new Phaser.Geom.Rectangle(this.x + this.speed.x * GameTime.getElapsed(), this.y + this.speed.y * GameTime.getElapsed(), this.hitbox.width, this.hitbox.height);
    };
    return Actor;
}());
/// <reference path="../entities/actor.ts"/>
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, new Phaser.Geom.Rectangle(100, 100, 14, 10)) || this;
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
    Player.prototype.onCollisionSolved = function () {
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
    BaseState.prototype.onCollisionSolved = function () {
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
    AirborneState.prototype.onCollisionSolved = function () {
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
    FallState.prototype.onCollisionSolved = function () {
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
    GroundedState.prototype.onCollisionSolved = function () {
    };
    return GroundedState;
}(BaseState));
var IdleState = /** @class */ (function (_super) {
    __extends(IdleState, _super);
    function IdleState(player) {
        return _super.call(this, player) || this;
    }
    IdleState.prototype.enter = function () {
    };
    IdleState.prototype.update = function () {
    };
    IdleState.prototype.onCollisionSolved = function () {
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
    JumpState.prototype.onCollisionSolved = function () {
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
    RunState.prototype.onCollisionSolved = function () {
    };
    return RunState;
}(GroundedState));
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
var Scenes;
(function (Scenes) {
})(Scenes || (Scenes = {}));
//# sourceMappingURL=game.js.map