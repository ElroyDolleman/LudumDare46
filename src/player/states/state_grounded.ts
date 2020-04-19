class GroundedState extends BaseState
{
    constructor(player: Player) {
        super(player);
        this.isGrouned = true;
    }

    public enter() {
    }
 
    public update() {

        if (Inputs.Jump.key.isDown && Inputs.Jump.heldDownFrames < 3) {
            this.player.speed.y = -PlayerStats.DefaultJumpPower;
            this.player.changeState(this.player.jumpState);
        }
        else if (Phaser.Input.Keyboard.JustDown(Inputs.Yell)) {
            this.player.speed.x = 0;
            this.player.changeState(this.player.yellState);
        }
        else if (Phaser.Input.Keyboard.JustDown(Inputs.Crouch)) {
            this.player.changeState(this.player.crouchState);
        }
    }

    public onCollisionSolved(result: CollisionResult) {
        
        if (!this.hasGroundUnderneath(result.tiles)) {
            this.player.changeState(this.player.fallState);
        }
    }

    protected hasGroundUnderneath(tiles: Tile[]):boolean {
        for (let i = 0; i < tiles.length; i++) {
            if (!tiles[i].canStandOn) {
                continue;
            }
            if (this.isStandingOnTile(tiles[i])) {
                return true;
            }
        }
        return false;
    }

    protected isStandingOnTile(tile: Tile):boolean {
        if (tile.hitbox.top == this.player.hitbox.bottom) {
            return this.player.hitbox.right > tile.hitbox.left && this.player.hitbox.left < tile.hitbox.right;
        }
    }
}