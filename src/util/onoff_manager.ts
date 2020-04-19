module OnOffState
{
    export let CurrentOnType: TileTypes = TileTypes.OnOffBlockA;
    export let CurrentOffType: TileTypes = TileTypes.OnOffBlockB;
    export let StateEvents: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();
    export let StateJustChanged: boolean = false;

    export function SwitchState() {
        if (CurrentOnType == TileTypes.OnOffBlockA) {
            CurrentOnType = TileTypes.OnOffBlockB;
            CurrentOffType = TileTypes.OnOffBlockA;
        }
        else {
            CurrentOnType = TileTypes.OnOffBlockA;
            CurrentOffType = TileTypes.OnOffBlockB;
        }

        StateEvents.emit('switched');
    }

    export function ForceState(state: TileTypes) {
        CurrentOnType = state;
        if (state == TileTypes.OnOffBlockA) {
            CurrentOffType = TileTypes.OnOffBlockB;
        }
        else {
            CurrentOffType = TileTypes.OnOffBlockA;
        }
    }
}