class JumpState extends AirborneState
{
    private isHoldingJump: boolean;
    private heldDownFrames: number;
    private heldDownFramesMax: number = 30;

    constructor(player: Player) {
        super(player);
    }

    public enter() {
        this.isHoldingJump = true;
    }
 
    public update() {
        if (this.isHoldingJump && (!Inputs.Jump.key.isDown || this.heldDownFrames > this.heldDownFramesMax)) {
            this.isHoldingJump = false;
        }
        else if (this.isHoldingJump) {
            this.heldDownFrames++;
            this.player.speed.y -= PlayerStats.DefaultGravity - 8;
        }

        if (this.player.speed.y >= -18) {
            this.player.speed.y -= 8;
        }

        this.updateGravity();

        if (this.player.speed.y >= 0) {
            this.player.changeState(this.player.fallState);
        }
    }

    public onCollisionSolved(result: CollisionResult) {
        super.onCollisionSolved(result);
    }
}