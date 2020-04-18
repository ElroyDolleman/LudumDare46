class GroundedState extends BaseState
{
    constructor(player: Player) {
        super(player);
    }

    public enter() {
    }
 
    public update() {

        if (Inputs.Jump.key.isDown && Inputs.Jump.heldDownFrames < 3) {
            this.player.speed.y = -PlayerStats.DefaultJumpPower;
            this.player.changeState(this.player.jumpState);
        }
    }

    public onCollisionSolved(result: CollisionResult) {
        
    }

    public updateRunControls(maxRunSpeed: number = PlayerStats.DefaultRunSpeed, runAcceleration: number = PlayerStats.DefaultRunAcceleration)
    {
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