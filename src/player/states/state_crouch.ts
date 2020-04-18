/// <reference path="state_grounded.ts"/>
class CrouchState extends GroundedState
{
    constructor(player: Player) {
        super(player);
    }
    
    public enter() {
        this.player.animator.changeAnimation(PlayerAnimations.Crouch);
        this.player.hitbox.height = PlayerStats.CrouchHitboxHeight;
        this.player.hitbox.y += (PlayerStats.DefaultHitboxHeight - PlayerStats.CrouchHitboxHeight);
    }

    public update() {
        if (Inputs.Crouch.isUp) {
            this.player.changeState(this.player.speed.x == 0 ? this.player.idleState : this.player.runState);
        }
        super.update();

        this.player.decelerate(PlayerStats.CrouchDeceleration);
    }

    public onCollisionSolved(result: CollisionResult) {
        super.onCollisionSolved(result);
    }

    public leave() {
        this.player.hitbox.height = PlayerStats.DefaultHitboxHeight;
        this.player.hitbox.y -= (PlayerStats.DefaultHitboxHeight - PlayerStats.CrouchHitboxHeight);
    }
}