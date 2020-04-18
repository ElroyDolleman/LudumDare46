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
    }

    public updateGravity(gravity: number = PlayerStats.DefaultGravity, maxFallSpeed: number = PlayerStats.DefaultMaxFallSpeed) {
        if (this.player.speed.y < maxFallSpeed) {
            this.player.speed.y = Math.min(this.player.speed.y + gravity, maxFallSpeed);
        }
    }

    protected land() {
        this.player.speed.y = 0;
        this.player.changeState(this.player.speed.x == 0 ? this.player.idleState : this.player.runState); 
    }

    protected headbonk() {
        this.player.speed.y = 0;
    }
}