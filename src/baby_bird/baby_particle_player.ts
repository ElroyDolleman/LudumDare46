class BabyParticlePlayer
{
    public particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
    public deathFallEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    public baby: Baby;

    constructor(baby: Baby) {
        this.baby = baby;

        this.deathFallEmitter = ParticleManager.createEmitter({
            x: 0,
            y: 0,
            lifespan: { min: 370, max: 560 },
            speed: { min: 4, max: 6 },
            angle: [240, 270, 300],
            frequency: -1,
            emitZone: { source: new Phaser.Geom.Rectangle(-2, -1, 3, 1) },
            frame: Particles.DustFrames
        });
    }

    public playDeathFall() {
        this.deathFallEmitter.explode(7, this.baby.hitbox.centerX, this.baby.hitbox.bottom);
    }

    public destroy() {

    }
}