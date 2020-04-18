class YellState extends GroundedState
{
    constructor(player: Player) {
        super(player);
    }
    
    public enter() {
        this.player.animator.changeAnimation(PlayerAnimations.Yell);
    }

    public update() {
        if (!this.player.animator.sprite.anims.isPlaying) {
            this.player.changeState(this.player.idleState);
        }
        if (Phaser.Geom.Intersects.CircleToRectangle(this.player.yellArea, this.player.baby.hitbox)) {
            this.player.baby.wait(true);
        }
    }

    public onCollisionSolved(result: CollisionResult) {
        
    }
}