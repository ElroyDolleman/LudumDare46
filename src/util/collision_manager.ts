class CollisionResult
{
    onTop: boolean = false;
    onLeft: boolean = false;
    onRight: boolean = false;
    onBottom: boolean = false;
}

class CollisionManager
{
    public static moveActor(actor: Actor):CollisionResult {
        
        let result: CollisionResult = new CollisionResult();
        let previousHitbox = actor.hitbox;
        
        if (actor.speed.x != 0) {
            actor.moveHorizontal();
            //TODO: Loop through tiles
        }
        
        if (actor.speed.x != 0) {
            actor.moveVertical();
            //TODO: Loop through tiles
        }
        
        return result;
    }
}