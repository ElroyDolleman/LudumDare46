class CollisionResult
{
    onTop: boolean = false;
    onLeft: boolean = false;
    onRight: boolean = false;
    onBottom: boolean = false;
    tiles: Tile[];
}

class CollisionManager
{
    private currentLevel: Level;

    constructor(level: Level) {
        this.currentLevel = level;
    }

    public moveActor(actor: Actor):CollisionResult {
        
        let tiles = this.currentLevel.map.getTilesFromRect(actor.hitbox);
        let result: CollisionResult = new CollisionResult();
        let previousHitbox = actor.hitbox;
        
        if (actor.speed.x != 0) {
            actor.moveHorizontal();
            for (let i = 0; i < tiles.length; i++) {
                if (!this.overlapsWithSolidTile(actor, tiles[i])) {
                    continue;
                }

                if (actor.speed.x > 0) {
                    result.onRight = true;
                    actor.hitbox.x = tiles[i].hitbox.x - actor.hitbox.width;
                }
                else {
                    result.onLeft = true;
                    actor.hitbox.x = tiles[i].hitbox.right;
                }
            }
        }

        if (actor.speed.y != 0) {
            actor.moveVertical();
            for (let i = 0; i < tiles.length; i++) {
                if (!this.overlapsWithSolidTile(actor, tiles[i])) {
                    continue;
                }

                if (actor.speed.y > 0) {
                    result.onBottom = true;
                    actor.hitbox.y = tiles[i].hitbox.y - actor.hitbox.height;
                }
                else {
                    result.onTop = true;
                    actor.hitbox.y = tiles[i].hitbox.bottom;
                }
            }
        }
        
        actor.onCollisionSolved(result);
        return result;
    }

    private overlapsWithSolidTile(actor: Actor, tile: Tile) {
        return tile.isSolid && Phaser.Geom.Rectangle.Overlaps(tile.hitbox, actor.hitbox);
    }
}