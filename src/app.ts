/// <reference path="scenes/playground_scene.ts"/>

let config = {
    type: Phaser.AUTO,
    width: 320,
    height: 320,
    scaleMode: 3,
    pixelArt: true,
    backgroundColor: '#3CBCFC',
    title: "Ludum Dare 46",
    version: "0.0.1",
    disableContextMenu: true,
    scene: [ PlaygroundScene ],
};

let game = new Phaser.Game(config);