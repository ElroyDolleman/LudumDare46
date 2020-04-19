class ScreenTransition
{
    private graphics: Phaser.GameObjects.Graphics;
    private time: number;
    private targetX: number;
    private startX: number;
    public active: boolean = true;

    public get done(): boolean { return this.time == 1 && this.active; };

    constructor() {
        this.graphics = Scenes.Current.add.graphics({ lineStyle: { width: 2, color: 0x0 }, fillStyle: { color: 0x0, alpha: 1 } });
        this.graphics.depth = 69;
        this.create();
    }

    create() {
        this.graphics.clear();

        let left1 = -60;
        let left2 = -10;
        let right1 = 380;
        let right2 = 330;

        let points = [{x:left2, y:0}];
        for (let y = 320 / 8; y <= 320; y += 320 / 8) {
            points.push({x:left1, y});
            points.push({x:left2, y});
            left1 -= 10;
            left2 -= 10;
        }
        for (let y = 320; y >= 0; y -= 320 / 8) {
            points.push({x:right1, y});
            points.push({x:right2, y});
            right1 += 10;
            right2 += 10;
        }

        this.graphics.fillPoints(points);
        this.graphics.x = 380;
    }

    startFirstPhase() {
        this.graphics.setVisible(true);
        this.time = 0;

        this.graphics.x = 440;
        this.startX = 440;
        this.targetX = 0;
    }

    startSecondPhase() {
        this.graphics.setVisible(true);
        this.time = 0;

        this.graphics.x = 0;
        this.startX = 0;
        this.targetX = -440;
    }

    update() {
        if (this.time == 1 || !this.active) {
            return;
        }

        this.time = Math.min(1, this.time + GameTime.getElapsed() * 2.5)

        this.graphics.x = Phaser.Math.Linear(this.startX, this.targetX, this.time);

        if (this.time == 1 && this.graphics.x <= -380) {
            this.graphics.setVisible(false);
        }
    }
}