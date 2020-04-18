class IdleState extends GroundedState
{
    constructor(player: Player) {
        super(player);
    }

    public enter() {
        this.player.speed.y = 48;
    }
 
    public update() {
    }

    public onCollisionSolved(result: CollisionResult) {
        
    }
}