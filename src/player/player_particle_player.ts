class PlayerParticlePlayer
{
    public particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
    public landDustEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    public jumpDustEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    public flyDustEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

    public player: Player;

    constructor(player: Player) {
        this.particles = Scenes.Current.add.particles('effects');
        this.player = player;

        let frameNames = Scenes.Current.anims.generateFrameNames('effects', { 
            prefix: 'dust_',
            suffix: '.png',
            end: 5,
            zeroPad: 2
        });
        let frames:string[] = [];
        frameNames.forEach((e) => { frames.push(e.frame.toString()); });

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

    public playFly() {
        this.flyDustEmitter.explode(6, this.player.hitbox.centerX, this.player.hitbox.centerY);
    }
    public playLand() {
        this.landDustEmitter.explode(12, this.player.hitbox.centerX, this.player.hitbox.bottom);
    }
    public playJump() {
        this.jumpDustEmitter.explode(8, this.player.hitbox.centerX, this.player.hitbox.bottom);
    }

    public destroy() {
        this.particles.destroy();
    }
}