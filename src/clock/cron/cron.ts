import { DateTime } from "../../datetime";
import { CronPattern, CronRule, CronRule } from "./pattern";

const predefined = {
    '@yearly': '0 0 0 1 1 *',
    '@annually': '0 0 0 1 1 *',
    '@monthly': '0 0 0 1 * *',
    '@weekly': '0 0 0 * * 0',
    '@daily': '0 0 0 * * *',
    '@hourly': '0 0 * * * *'
};

export class Cron {
    [Symbol.toStringTag] = 'Cron';

    private _pattern: CronPattern;
    private _job: (self: Cron) => void;

    constructor(pattern: string, job: (self: Cron) => void) {
        this._pattern = CronPattern.of(pattern in predefined ? predefined[pattern as keyof typeof predefined] : pattern);
        this._job = job;
    }

    get pattern(): CronPattern {
        return this._pattern;
    }

    get job(): (self: Cron) => void {
        return this._job;
    }

    nextRun(from: DateTime = DateTime.now()): DateTime {
        if ('from' in this.pattern.sec[0]) {
            let a = this.pattern.sec[0];
        } else {
            let a = this.pattern.sec[0];
        }
    }

    nextRuns(length: number, from: DateTime = DateTime.now()): DateTime[] {
    }

    msToNextRun(from: DateTime = DateTime.now()): number {
    }

    isRunning(): boolean {

    }

    isStopped(): boolean {
    }

    isBusy(): boolean {
    }

    execute(): void {
        return this._job(this);
    }

    pause(): void {
    }

    resume(): void {
    }

    stop(): void {
    }

    [Symbol.iterator](): IterableIterator<DateTime> {

    }
}