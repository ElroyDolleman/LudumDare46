/// <reference path="baby_basestate.ts"/>
class BabyWalkState extends BabyBaseState
{
    constructor(baby: Baby) {
        super(baby);
    }

    public enter() {
        this.baby.speed.x = BabyStats.DefaultWalkSpeed * this.baby.animator.facingDirection;
    }

    public update() {
    }

    public onCollisionSolved(result: CollisionResult) {
        if (result.onRight) {
            this.baby.speed.x = -BabyStats.DefaultWalkSpeed;
        }
        else if (result.onLeft) {
            this.baby.speed.x = BabyStats.DefaultWalkSpeed;
        }
        if (!this.hasGroundUnderneath(result.tiles)) {
            this.baby.changeState(this.baby.airState);
        }
    }

    protected hasGroundUnderneath(tiles: Tile[]):boolean {
        for (let i = 0; i < tiles.length; i++) {
            if (!tiles[i].canStandOn) {
                continue;
            }
            if (this.isStandingOnTile(tiles[i])) {
                return true;
            }
        }
        return false;
    }

    protected isStandingOnTile(tile: Tile):boolean {
        if (tile.hitbox.top == this.baby.hitbox.bottom) {
            return this.baby.hitbox.right > tile.hitbox.left && this.baby.hitbox.left < tile.hitbox.right;
        }
    }
}