/// <reference path="scenes/game_scene.ts"/>

let config = {
    type: Phaser.AUTO,
    width: 320,
    height: 320,
    scaleMode: 3,
    pixelArt: true,
    backgroundColor: '#0x0',
    title: "Ludum Dare 46",
    version: "0.2.1",
    disableContextMenu: true,
    scene: [ GameScene ],
    fps: {
        target: 60,
        min: 60,
        forceSetTimeOut: true
    },
};

let game = new Phaser.Game(config);