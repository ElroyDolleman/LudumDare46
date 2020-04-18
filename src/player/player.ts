
class Player
{
    public animator: PlayerAnimator;

    constructor() {
        this.animator = new PlayerAnimator(this);
    }

    public update(time: number, delta: number) {
        this.animator.update(time, delta);
    }
}