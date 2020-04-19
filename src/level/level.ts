class Level
{
    public collisionManager: CollisionManager;
    public map: Tilemap;
    public collidableActors: Actor[];
    public goalPieces: Tile[];
    public goalPos: Phaser.Math.Vector2;
    public babySpawn: Phaser.Math.Vector2;
    public name: string;

    constructor(map: Tilemap, name: string, goalPieces: Phaser.Geom.Point[], babySpawn: Phaser.Math.Vector2) {
        this.collisionManager = new CollisionManager(this);
        this.collidableActors = [];
        this.map = map;
        this.name = name;
        this.babySpawn = babySpawn;

        this.goalPieces = [];
        goalPieces.forEach((pos) => {
            this.goalPieces.push(this.map.getTile(pos.x, pos.y));
        });

        let left = Math.min(this.goalPieces[0].hitbox.left, this.goalPieces[1].hitbox.left);
        let right = Math.max(this.goalPieces[0].hitbox.right, this.goalPieces[1].hitbox.right);
        let diff = right - left;
        this.goalPos = new Phaser.Math.Vector2(right - diff / 2, this.goalPieces[0].hitbox.top);
    }

    public update() {
        
    }

    public updateCollision() {
        this.collidableActors.forEach(actor => {
            let result = this.collisionManager.moveActor(actor);

            this.goalPieces.every((tile) => {
                if (Phaser.Geom.Rectangle.Overlaps(actor.hitbox, tile.hitbox) || actor.hitbox.bottom == tile.hitbox.top) {
                    actor.isTouchingGoal = true;
                    actor.goalTile = tile;
                    return false;
                }
                else {
                    actor.isTouchingGoal = false;
                    actor.goalTile = null;
                }
            });

            // this.map.clearHitboxDrawings();
            // for (let i = 0; i < result.tiles.length; i++) {
            //     result.tiles[i].drawHitbox()
            // }
        });
    }

    public removeCollidableActor(actor: Actor) {
        let index = this.collidableActors.indexOf(actor);
        if (index < 0) return;
        this.collidableActors.splice(index, 1);
    }

    public destroy() {
        this.map.destroy();
    }
}