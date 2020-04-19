class DeadState extends BaseState
{
    public hideOnDeath: boolean = true;

    constructor(player: Player) {
        super(player);
    }

    public enter() {
        if (this.hideOnDeath) {
            this.player.animator.sprite.setVisible(false);
            this.player.speed.x = 0;
            this.player.speed.y = 0;
        }
        else {
            //TODO: Dead animation
            //this.player.animator.changeAnimation('dead');
            this.player.speed.x = 0;
        }
    }

    public update() {
    }

    public onCollisionSolved(result: CollisionResult) {
    }
}