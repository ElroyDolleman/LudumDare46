class BaseState
{
    protected player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    public enter() {
    }

    public update(time: number, delta: number) {
    }

    public onCollisionSolved() {

    }
}