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
        this.updateGravity();
    }

    public onCollisionSolved(result: CollisionResult) {
        super.onCollisionSolved(result);
    }
}