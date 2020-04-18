class BabyGroundedState extends BabyBaseState
{
    constructor(baby: Baby) {
        super(baby);
    }

    public enter() {
    }

    public update() {
    }

    public onCollisionSolved(result: CollisionResult) {
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