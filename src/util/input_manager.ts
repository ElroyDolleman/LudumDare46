module Inputs
{
    export let Up: Phaser.Input.Keyboard.Key;
    export let Left: Phaser.Input.Keyboard.Key;
    export let Down: Phaser.Input.Keyboard.Key;
    export let Right: Phaser.Input.Keyboard.Key;
    
    export let Jump: { key: Phaser.Input.Keyboard.Key, heldDownFrames: number };
}

class InputManager
{
    public constructor(scene: Phaser.Scene) {
        Inputs.Up = scene.input.keyboard.addKey('up');
        Inputs.Left = scene.input.keyboard.addKey('left');
        Inputs.Down = scene.input.keyboard.addKey('down');
        Inputs.Right = scene.input.keyboard.addKey('right');
        Inputs.Jump = { key: scene.input.keyboard.addKey('z'), heldDownFrames: 0 };
    }

    public update()
    {
        if (Inputs.Jump.key.isDown) {
            Inputs.Jump.heldDownFrames++;
        }
        else {
            Inputs.Jump.heldDownFrames = 0;
        }
    }
}