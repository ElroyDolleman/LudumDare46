class BaseState
{
    protected player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    public enter() {
    }

    public update() {
    }

    public onCollisionSolved(result: CollisionResult) {

    }

    protected updateMovementControls(maxRunSpeed: number = PlayerStats.DefaultRunSpeed, runAcceleration: number = PlayerStats.DefaultRunAcceleration) {
        if (Inputs.Left.isDown) {
            if (this.player.speed.x > -maxRunSpeed) {
                this.player.speed.x = Math.max(this.player.speed.x - runAcceleration, -maxRunSpeed);
            }
            else if (this.player.speed.x < -maxRunSpeed) {
                this.player.speed.x = Math.min(this.player.speed.x + runAcceleration, -maxRunSpeed);
            }
        }
        else if (Inputs.Right.isDown) {
            if (this.player.speed.x < maxRunSpeed) {
                this.player.speed.x = Math.min(this.player.speed.x + runAcceleration, maxRunSpeed);
            }
            else if (this.player.speed.x > maxRunSpeed) {
                this.player.speed.x = Math.max(this.player.speed.x - runAcceleration, maxRunSpeed);
            }
        }
        else {
            if (Math.abs(this.player.speed.x) < runAcceleration) {
                this.player.speed.x = 0;
            }
            else {
                this.player.speed.x -= runAcceleration * MathHelper.sign(this.player.speed.x);
            }
        }
    }
}