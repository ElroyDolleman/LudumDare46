module GameTime
{
    export const fps = 60;
    export let frame = 0;

    export function getElapsed(): number
    {
        return 1 / this.fps;
    }

    export function getElapsedMS(): number
    {
        return 1000 / this.fps;
    }

    export function getTotalSeconds(): number
    {
        return frame / 60;
    }

    export function getTotalMinutes(): number
    {
        return this.getTotalSeconds() / 60;
    }

    export function getTotalHours(): number
    {
        return this.getTotalMinutes() / 60;
    }

    export function totalTimeStringFormat(): string
    {
        let minutes = String(Math.floor(this.getTotalMinutes()));

        if (minutes.length < 2) {
            minutes = "0" + minutes;
        }

        let secondsPrefix = "";
        let seconds = this.getTotalSeconds();

        if (seconds < 10) {
            secondsPrefix = "0";
        }
        
        return String(Math.floor(this.getTotalHours())) + ":" + minutes + ":" + secondsPrefix + String(seconds);
    }
}