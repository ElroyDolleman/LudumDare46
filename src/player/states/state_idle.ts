class IdleState extends GroundedState
{
    constructor(player: Player) {
        super(player);
    }

    public enter() {
        this.player.animator.changeAnimation(PlayerAnimations.Idle);
    }
 
    public update() {
        this.updateMovementControls();

        if (this.player.speed.x != 0) {
            this.player.changeState(this.player.runState);
        }

        super.update();
    }

    public onCollisionSolved(result: CollisionResult) {
        super.onCollisionSolved(result);
    }
}