class CollisionResult
{
    onTop: boolean = false;
    onLeft: boolean = false;
    onRight: boolean = false;
    onBottom: boolean = false;
    tiles: Tile[] = [];
    prevTop: number = 0;
    prevLeft: number = 0;
    prevRight: number = 0;
    prevBottom: number = 0;
}

class CollisionManager
{
    private currentLevel: Level;

    constructor(level: Level) {
        this.currentLevel = level;
    }

    public moveActor(actor: Actor):CollisionResult {
        
        let result: CollisionResult = new CollisionResult();
        let tiles = this.currentLevel.map.getTilesFromRect(actor.calculateNextHitbox(), 2);
        result.prevTop = actor.hitbox.top;
        result.prevLeft = actor.hitbox.left;
        result.prevRight = actor.hitbox.right;
        result.prevBottom = actor.hitbox.bottom;
        
        if (actor.speed.x != 0) {
            actor.moveHorizontal();
            for (let i = 0; i < tiles.length; i++) {
                if (!tiles[i].isSolid || !Phaser.Geom.Rectangle.Overlaps(tiles[i].hitbox, actor.hitbox)) {
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
                if (!tiles[i].canStandOn || !Phaser.Geom.Rectangle.Overlaps(tiles[i].hitbox, actor.hitbox)) {
                    continue;
                }
                if (tiles[i].isSemisolid) {
                    if (this.isFallingThroughSemisolid(tiles[i], result.prevBottom, actor.hitbox.bottom)) {
                        result.onBottom = true;
                        actor.hitbox.y = tiles[i].hitbox.y - actor.hitbox.height;
                    }
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
        
        result.tiles = tiles;
        actor.onCollisionSolved(result);
        return result;
    }

    private isFallingThroughSemisolid(semisolidTile: Tile, prevBottom: number, currentBottom: number) {
        return prevBottom <= semisolidTile.hitbox.top && currentBottom >= semisolidTile.hitbox.top;
    }
}