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
            this.collisionManager.moveActor(actor);
        });
    }
}