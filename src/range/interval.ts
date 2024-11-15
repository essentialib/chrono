import { IBase } from "../datetime/base";
import { Period } from "./period";

export abstract class Interval<T extends IBase, F> {
    constructor(public start: T, public end: T) {
        if (start.isAfter(end))
            throw new Error(`Interval end must be after start, ${start.toString()} ~ ${end.toString()}`);
        if (start.locale.code !== end.locale.code)
            throw new Error(`Locale mismatch, ${start.locale.code} and ${end.locale.code}`);
    }

    abstract range(field: F): T[];

    abstract toPeriod(): Period;

    toString(): string {
        return `Interval(${this.start.toString()} ~ ${this.end.toString()})`;
    }

    contains(value: T): boolean {
        return this.start.isBeforeOrEquals(value) && value.isBeforeOrEquals(this.end);
    }

    equals(other: Interval<T, F>): boolean {
        return this.start.equals(other.start) && this.end.equals(other.end);
    }
}