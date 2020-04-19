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
    isCrushed: boolean = false;
    isDamaged: boolean = false;
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
        
        actor.moveHorizontal();
        if (actor.hitbox.x < 0) {
            actor.hitbox.x = 0;
        }
        else if (actor.hitbox.right > 320) {
            actor.hitbox.x = 320 - actor.hitbox.width;
        }

        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].isEmpty || !Phaser.Geom.Rectangle.Overlaps(tiles[i].hitbox, actor.hitbox)) {
                continue;
            }
            if (!tiles[i].isSolid) {
                if (tiles[i].canDamage) {
                    result.isDamaged = true;
                    continue;
                }
                else if (actor.canTriggerOnOffSwitch && tiles[i].isOnOffSwitch) {
                    tiles[i].triggerSwitch(actor);
                }
                continue;
            }
            if (tiles[i].isOnOffBlock && OnOffState.StateJustChanged) {
                if (actor.hitbox.left < tiles[i].hitbox.left && !this.currentLevel.map.getTileNextTo(tiles[i], -1, 0).isSolid) {
                    result.onRight = true;
                    actor.hitbox.x = tiles[i].hitbox.x - actor.hitbox.width;
                    continue;
                }
                else if (actor.hitbox.right > tiles[i].hitbox.right && !this.currentLevel.map.getTileNextTo(tiles[i], 1, 0).isSolid) {
                    result.onLeft = true;
                    actor.hitbox.x = tiles[i].hitbox.right;
                    continue;
                }
                else {
                    result.isCrushed = true;
                    continue;
                }
            }
            if (tiles[i].canDamage) {
                result.isDamaged = true;
                continue;
            }

            if (actor.speed.x > 0) {
                result.onRight = true;
                actor.hitbox.x = tiles[i].hitbox.x - actor.hitbox.width;
            }
            else if (actor.speed.x < 0) {
                result.onLeft = true;
                actor.hitbox.x = tiles[i].hitbox.right;
            }
        }

        actor.moveVertical();
        if (actor.hitbox.y < 0) {
            actor.hitbox.y = 0;
        }
        else if (actor.hitbox.bottom > 320) {
            actor.hitbox.y = 320 - actor.hitbox.height;
        }

        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].isEmpty || !Phaser.Geom.Rectangle.Overlaps(tiles[i].hitbox, actor.hitbox)) {
                continue;
            }
            if (!tiles[i].canStandOn) {
                if (tiles[i].canDamage) {
                    result.isDamaged = true;
                    continue;
                }
                else if (actor.canTriggerOnOffSwitch && tiles[i].isOnOffSwitch) {
                    tiles[i].triggerSwitch(actor);
                }
                continue;
            }
            if (tiles[i].isSemisolid) {
                if (this.isFallingThroughSemisolid(tiles[i], result.prevBottom, actor.hitbox.bottom)) {
                    result.onBottom = true;
                    actor.hitbox.y = tiles[i].hitbox.y - actor.hitbox.height;
                }
                continue;
            }
            if (tiles[i].isOnOffBlock && OnOffState.StateJustChanged) {
                if (actor.hitbox.top < tiles[i].hitbox.top && !this.currentLevel.map.getTileNextTo(tiles[i], 0, -1).isSolid) {
                    result.onBottom = true;
                    actor.hitbox.y = tiles[i].hitbox.y - actor.hitbox.height;
                    continue;
                }
                else if (actor.hitbox.bottom > tiles[i].hitbox.bottom && !this.currentLevel.map.getTileNextTo(tiles[i], 0, 1).isSolid) {
                    result.onTop = true;
                    actor.hitbox.y = tiles[i].hitbox.bottom;
                    continue;
                }
                else {
                    result.isCrushed = true;
                    continue;
                }
            }

            if (actor.speed.y > 0) {
                result.onBottom = true;
                actor.hitbox.y = tiles[i].hitbox.y - actor.hitbox.height;
            }
            else if (actor.speed.y < 0) {
                result.onTop = true;
                actor.hitbox.y = tiles[i].hitbox.bottom;
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