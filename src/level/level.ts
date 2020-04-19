class Level
{
    public collisionManager: CollisionManager;
    public map: Tilemap;
    public collidableActors: Actor[];

    constructor(map: Tilemap) {
        this.collisionManager = new CollisionManager(this);
        this.collidableActors = [];
        this.map = map;
    }

    public update() {
        
    }

    public updateCollision() {
        this.collidableActors.forEach(actor => {
            let result = this.collisionManager.moveActor(actor);

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
}