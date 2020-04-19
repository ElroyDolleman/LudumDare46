let TILE_WIDTH: number = 16;
let TILE_HEIGHT: number = 16;
let CurrentLevel: Level;
let ParticleManager: Phaser.GameObjects.Particles.ParticleEmitterManager;

module Scenes
{
    export let Current: Phaser.Scene;
}

module Particles
{
    export let DustFrames: string[] = [];
}