class FallState extends AirborneState
{
    constructor(player: Player) {
        super(player);
    }

    public enter() {
    }
 
    public update() {
        this.updateGravity();
    }

    public onCollisionSolved(result: CollisionResult) {
        super.onCollisionSolved(result);
    }
}