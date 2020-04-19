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

            for (let i = 0; i < this.goalPieces.length; i++) {
                if (Phaser.Geom.Rectangle.Overlaps(actor.hitbox, this.goalPieces[i].hitbox) 
                || (actor.hitbox.bottom == this.goalPieces[i].hitbox.top && actor.hitbox.right > this.goalPieces[i].hitbox.left && actor.hitbox.left < this.goalPieces[i].hitbox.right)) {

                    actor.isTouchingGoal = true;
                    actor.goalTile = this.goalPieces[i];
                    break;
                }
                else {
                    actor.isTouchingGoal = false;
                    actor.goalTile = null;
                }
            }

            // this.map.clearHitboxDrawings();
            // for (let i = 0; i < result.this.goalPieces[i]s.length; i++) {
            //     result.this.goalPieces[i]s[i].drawHitbox()
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