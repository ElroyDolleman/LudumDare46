class EndScreen
{
    topText: Phaser.GameObjects.Text;
    bottomText: Phaser.GameObjects.Text;

    constructor() {
        
    }

    public show() {
        this.topText = Scenes.Current.add.text(320/2, 100, 'text', {
            fontFamily: 'birdseed',
            align: 'center',
            fontSize: '32px',
        });
        this.bottomText = Scenes.Current.add.text(320/2, 200, 'text', {
            fontFamily: 'birdseed',
            align: 'center',
            fontSize: '16px',
        });

        this.topText.text = "The End!";
        this.bottomText.text = "Thanks for playing";
        this.topText.depth = 69+1;
        this.bottomText.depth = 69+1;
        this.topText.setOrigin(0.5, 0.5);
        this.bottomText.setOrigin(0.5, 0.5);
    }
}
let endScreen: EndScreen = new EndScreen();