class RunState extends GroundedState
{
    constructor(player: Player) {
        super(player);
    }

    public enter() {
        this.player.animator.changeAnimation('run');
    }
 
    public update() {
        this.updateRunControls();

        if (this.player.speed.x == 0) {
            this.player.changeState(this.player.idleState);
        }

        super.update();
    }

    public onCollisionSolved(result: CollisionResult) {
        
    }
}