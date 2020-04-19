/// <reference path="scenes/game_scene.ts"/>

let config = {
    type: Phaser.AUTO,
    width: 320,
    height: 320,
    scaleMode: 3,
    pixelArt: true,
    backgroundColor: '#3CBCFC',
    title: "Ludum Dare 46",
    version: "0.1.0",
    disableContextMenu: true,
    scene: [ GameScene ],
};

let game = new Phaser.Game(config);