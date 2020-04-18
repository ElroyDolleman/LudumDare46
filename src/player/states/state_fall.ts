class FallState extends AirborneState
{
    constructor(player: Player) {
        super(player);
    }

    public enter() {
        this.player.animator.changeAnimation(PlayerAnimations.Fall);
    }
 
    public update() {
        this.updateMovementControls();

        if (Inputs.Jump.key.isDown && Inputs.Jump.heldDownFrames <= 1) {
            this.player.changeState(this.player.flyState);
        }
        else {
            this.updateGravity();
        }
    }

    public onCollisionSolved(result: CollisionResult) {
        super.onCollisionSolved(result);
    }
}