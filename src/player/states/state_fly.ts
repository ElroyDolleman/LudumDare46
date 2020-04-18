class FlyState extends AirborneState
{
    constructor(player: Player) {
        super(player);
    }

    public enter() {
        this.player.animator.changeAnimation(PlayerAnimations.Fly);
        this.player.speed.y = -PlayerStats.FlyPower;
    }
 
    public update() {
        this.updateMovementControls();
        
        if (Inputs.Down.isDown) {
            this.player.speed.y = Math.max(this.player.speed.y, -10);
            this.player.changeState(this.player.fallState);
        }
        else if (Inputs.Jump.key.isDown && Inputs.Jump.heldDownFrames <= 1) {
            this.player.speed.y = -PlayerStats.FlyPower;
        }
        else {
            this.updateGravity(PlayerStats.FlyingGravity, PlayerStats.FlyingMaxFallSpeed);
        }

        if (this.player.speed.y < 0) {
            this.player.animator.setTimeScale(1);
        }
        else {
            this.player.animator.setTimeScale(0.5);
        }
    }

    public onCollisionSolved(result: CollisionResult) {
        super.onCollisionSolved(result);
    }
}