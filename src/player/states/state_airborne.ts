class AirborneState extends BaseState
{
    constructor(player: Player) {
        super(player);
    }

    public enter() {
    }
 
    public update() {
    }

    public onCollisionSolved(result: CollisionResult) {
        if (result.onBottom) {
            this.land();
        }
        else if (result.onTop) {
            this.headbonk();
        }
        if (result.onLeft || result.onRight) {
            this.player.speed.x = 0;
        }
    }

    public updateGravity(gravity: number = PlayerStats.DefaultGravity, maxFallSpeed: number = PlayerStats.DefaultMaxFallSpeed) {
        if (this.player.speed.y < maxFallSpeed) {
            this.player.speed.y = Math.min(this.player.speed.y + gravity, maxFallSpeed);
        }
    }

    protected land() {
        let landImpact = this.player.speed.y;
        this.player.speed.y = 0;
        this.player.changeState(this.player.speed.x == 0 ? this.player.idleState : this.player.runState);

        if (landImpact == PlayerStats.DefaultMaxFallSpeed) {
            this.player.animator.squish(1.1, 0.8, 240);
            this.player.particlePlayer.playLand();
        } else {
            this.player.animator.squish(1, 0.8, 160);
        }
    }

    protected headbonk() {
        this.player.speed.y = 0;
        this.player.animator.squish(1.1, 0.8, 140);
    }
}