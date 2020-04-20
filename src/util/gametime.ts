module GameTime
{
    export let currentElapsedMS: number = 0;

    export function getElapsed(): number
    {
        return this.currentElapsedMS / 1000;
    }

    export function getElapsedMS(): number
    {
        return this.currentElapsedMS;
    }
}