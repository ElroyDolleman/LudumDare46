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
        this.collidableActors.forEach(actor => {
            let result = this.collisionManager.moveActor(actor);

            this.map.clearHitboxDrawings();
            for (let i = 0; i < result.tiles.length; i++) {
                result.tiles[i].drawHitbox()
            }
        });
    }
}