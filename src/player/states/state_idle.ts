class IdleState extends GroundedState
{
    constructor(player: Player) {
        super(player);
    }

    public enter() {
        this.player.animator.changeAnimation('idle');
    }
 
    public update() {
        this.updateRunControls();

        if (this.player.speed.x != 0) {
            this.player.changeState(this.player.runState);
        }

        super.update();
    }

    public onCollisionSolved(result: CollisionResult) {
        
    }
}