class WinState extends GroundedState 
{
    public goalTile: Tile;
    public done: boolean;

    constructor(player: Player) {
        super(player);
    }

    public enter() {
        this.player.animator.changeAnimation(PlayerAnimations.Idle);
        this.player.speed.x = 0;
        this.done = false;
    }

    public update() {
        if (this.done) {
            return;
        }

        if (this.goalTile.hitbox.top < this.player.hitbox.bottom) {
            this.player.speed.y = -PlayerStats.JumpInGoalPower;
        }
        else if (this.goalTile.hitbox.top > this.player.hitbox.bottom) {
            this.player.speed.y += PlayerStats.DefaultGravity;
        }
        else if (this.player.speed.y > 0) {
            this.player.speed.y = 0;
        }

        if (Phaser.Math.Difference(this.player.hitbox.centerX, CurrentLevel.goalPos.x) <= PlayerStats.DefaultRunSpeed * GameTime.getElapsed()) {
            this.player.hitbox.centerX = CurrentLevel.goalPos.x;
            this.player.speed.x = 0;
        }
        else if (this.player.hitbox.centerX < CurrentLevel.goalPos.x) {
            this.player.speed.x = PlayerStats.DefaultRunSpeed;
        }
        else if (this.player.hitbox.centerX > CurrentLevel.goalPos.x) {
            this.player.speed.x = -PlayerStats.DefaultRunSpeed;
        }

        if (!this.done && this.player.hitbox.centerX == CurrentLevel.goalPos.x && this.goalTile.hitbox.top == this.player.hitbox.bottom) {
            this.player.animator.changeAnimation(PlayerAnimations.Celebrate);
            this.done = true;
        }
    }

    public onCollisionSolved(result: CollisionResult) {
        
    }
}