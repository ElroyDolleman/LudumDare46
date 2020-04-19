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
        this.player.animator.changeAnimation(PlayerAnimations.Jump);
    }
 
    public update() {
        this.updateMovementControls();

        if (this.isHoldingJump && (!Inputs.Jump.key.isDown || this.heldDownFrames > this.heldDownFramesMax)) {
            this.isHoldingJump = false;
        }
        else if (this.isHoldingJump) {
            this.heldDownFrames++;
            this.player.speed.y -= PlayerStats.DefaultGravity - 8;
        }
        else if (Inputs.Jump.key.isDown && Inputs.Jump.heldDownFrames <= 1) {
            this.player.changeState(this.player.flyState);
            return;
        }

        this.updateGravity();

        if (this.player.speed.y >= 0) {
            this.player.changeState(this.player.fallState);
        }
        else if (Phaser.Geom.Rectangle.Overlaps(this.player.baby.hitbox, this.player.bounceHitbox)) {
            this.player.baby.momentumPushUp(-this.player.speed.y + 66);
        }
    }

    public onCollisionSolved(result: CollisionResult) {
        super.onCollisionSolved(result);
    }
}