module Inputs
{
    export let Left: Phaser.Input.Keyboard.Key;
    export let Right: Phaser.Input.Keyboard.Key;
    export let Jump: { key: Phaser.Input.Keyboard.Key, heldDownFrames: number };
}

class InputManager
{
    public constructor(scene: Phaser.Scene) {
        Inputs.Left = scene.input.keyboard.addKey('left');
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