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
        CurrentGameScene = this;
        this.player = new Player();
    };
    PlaygroundScene.prototype.update = function (time, delta) {
        this.player.update(time, delta);
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
var Player = /** @class */ (function () {
    function Player() {
        this.animator = new PlayerAnimator(this);
    }
    Player.prototype.update = function (time, delta) {
        this.animator.update(time, delta);
    };
    return Player;
}());
var PlayerAnimator = /** @class */ (function () {
    function PlayerAnimator(player) {
        this.player = player;
        this.sprite = CurrentGameScene.add.sprite(100, 100, 'player', 'playerbird_walk_00.png');
        this.createAnimation('run', 'playerbird_walk_', 2);
        this.sprite.play('run');
    }
    PlayerAnimator.prototype.update = function (time, delta) {
    };
    PlayerAnimator.prototype.updatePosition = function () {
        this.sprite.setPosition(0, 0);
    };
    PlayerAnimator.prototype.createAnimation = function (key, prefix, length, frameRate) {
        if (frameRate === void 0) { frameRate = 16; }
        var frameNames = CurrentGameScene.anims.generateFrameNames('player', {
            prefix: prefix,
            suffix: '.png',
            end: length,
            zeroPad: 2
        });
        CurrentGameScene.anims.create({
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
    BaseState.prototype.update = function (time, delta) {
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
    AirborneState.prototype.update = function (time, delta) {
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
    FallState.prototype.update = function (time, delta) {
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
    GroundedState.prototype.update = function (time, delta) {
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
    IdleState.prototype.update = function (time, delta) {
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
    JumpState.prototype.update = function (time, delta) {
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
    RunState.prototype.update = function (time, delta) {
    };
    RunState.prototype.onCollisionSolved = function () {
    };
    return RunState;
}(GroundedState));
var CurrentGameScene;
//# sourceMappingURL=game.js.map