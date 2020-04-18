class PanicState extends AirborneState
{
    randomlyMoving: boolean;

    constructor(player: Player) {
        super(player);
    }

    public enter() {
        this.player.animator.changeAnimation(PlayerAnimations.Panic);
        this.player.speed.x = 0;

        let direction = MathHelper.sign(this.player.baby.hitbox.centerX - this.player.hitbox.centerX);
        this.player.animator.facingDirection = direction;

        this.randomlyMoving = true;
    }

    public update() {
        this.updateGravity();

        if (this.randomlyMoving) {
            this.updatePanicRunning();
        }
    }

    public updatePanicRunning() {
        if (this.player.speed.x == 0) {
            this.player.speed.x = PlayerStats.PanicRunSpeed * (Math.random() > 0.5 ? 1 : -1);
            setTimeout(() => {
                if (this && this.player) this.player.speed.x = 0;
            }, Phaser.Math.Between(100, 300));
        }
    }

    public onCollisionSolved(result: CollisionResult) {
        if (result.onBottom) {
            this.player.speed.y = 0;
        }
        if (result.onRight) {
            this.player.speed.x = -PlayerStats.PanicRunSpeed;
        }
        else if (result.onLeft) {
            this.player.speed.x = PlayerStats.PanicRunSpeed;
        }
    }
}