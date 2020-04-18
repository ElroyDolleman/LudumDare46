class IdleState extends GroundedState
{
    constructor(player: Player) {
        super(player);
    }

    public enter() {
        
    }
 
    public update() {

        if (Inputs.Left.isDown) {
            this.player.speed.x = -PlayerStats.DefaultRunSpeed;
            this.player.changeState(this.player.runState);
        }
        if (Inputs.Right.isDown) {
            this.player.speed.x = PlayerStats.DefaultRunSpeed;
            this.player.changeState(this.player.runState);
        }
    }

    public onCollisionSolved(result: CollisionResult) {
        
    }
}