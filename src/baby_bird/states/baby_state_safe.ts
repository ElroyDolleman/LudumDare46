class BabySafeState extends BabyGroundedState {
    
    public goalTile: Tile;

    constructor(baby: Baby) {
        super(baby);
    }

    public enter() {
        this.baby.speed.x = 0;
        this.baby.animator.changeAnimation('babybird_walk_00.png', true);
    }

    public update() {
        if (this.goalTile.hitbox.top < this.baby.hitbox.bottom) {
            this.baby.speed.y = -BabyStats.JumpInGoalPower;
        }
        else if (this.goalTile.hitbox.top > this.baby.hitbox.bottom) {
            this.baby.speed.y += BabyStats.DefaultGravity;
        }
        else if (this.baby.speed.y > 0) {
            this.baby.speed.y = 0;
        }

        if (Phaser.Math.Difference(this.baby.hitbox.centerX, CurrentLevel.goalPos.x) <= BabyStats.DefaultWalkSpeed * GameTime.getElapsed()) {
            this.baby.hitbox.centerX = CurrentLevel.goalPos.x;
            this.baby.speed.x = 0;
        }
        else if (this.baby.hitbox.centerX < CurrentLevel.goalPos.x) {
            this.baby.speed.x = BabyStats.DefaultWalkSpeed;
        }
        else if (this.baby.hitbox.centerX > CurrentLevel.goalPos.x) {
            this.baby.speed.x = -BabyStats.DefaultWalkSpeed;
        }
    }

    public onCollisionSolved(result: CollisionResult) {

    }
}