// 0-20/2
// 0-15
// 14,18,20
// *
// */5
// 4/5
// 1,2,3/5
// 1,2,3-5
// 23 1,2-4/2,4 * * *
// 23 */2,*/3 * * *

import { DateTime } from "../../datetime";
import { getLocale, Locale } from "../../locales";

// '0-20/2' -> { from: 0, to: 20, step: 2 }
// '0-20' -> { from: 0, to: 20 }
// '14,18' -> { values: [14, 18] }
// '*' -> {}
// '*/3' -> { step: 3 }
// '5' -> { value: 5 }

export class ParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ParseError';
    }
}

export type CronRule = { from: number, to: number, step: number } | { value: '*' | number, step: number | undefined };

export class CronPattern {
    [Symbol.toStringTag] = 'CronPattern';

    private readonly _pattern: string;
    private readonly _locale: Locale;
    private readonly _sec: CronRule[];
    private readonly _min: CronRule[];
    private readonly _hour: CronRule[];
    private readonly _day: CronRule[];
    private readonly _month: CronRule[];
    private readonly _week: CronRule[];
    private readonly _year: CronRule[] | undefined;

    private constructor(pattern: string, locale: Locale = getLocale()) {
        this._pattern = pattern;
        this._locale = locale;

        const [sec, min, hour, day, month, week, year] = this._pattern.split(/\s+/).map(CronPattern.parseField);

        this._sec = sec;
        this._min = min;
        this._hour = hour;
        this._day = day;
        this._month = month;
        this._week = week;
        this._year = year;
    }

    static of(pattern: string, locale?: Locale): CronPattern {
        return new CronPattern(pattern, locale);
    }

    static parseField(pattern: string): CronRule[] {
        return pattern.split(',').map(e => {
            // [ '{from}-{to}', step ]
            const [front, back] = e.split('/');
            const [start, end] = front.split('-');

            const from = parseInt(start), to = parseInt(end), step = parseInt(back);

            if (back !== undefined && isNaN(step))
                throw new ParseError(`Invalid pattern: ${pattern}`);

            if (start !== undefined && end !== undefined) {
                if (isNaN(from) || isNaN(to))
                    throw new ParseError(`Invalid pattern: ${pattern}`);
                
                return { from, to, step: back !== undefined ? step : 1 };
            }
            else if (start !== undefined) {
                if (start !== '*' && isNaN(from))
                    throw new ParseError(`Invalid pattern: ${pattern}`);

                return { value: start === '*' ? start : from, step: back !== undefined ? step : undefined };
            }
            else
                throw new ParseError(`Invalid pattern: ${pattern}`);
        });
    }

    static isMatchField(each: CronRule[] | undefined, value: number): boolean {
        if (each === undefined)
            return true;

        for (const rule of each) {
            if ('from' in rule) {
                if (rule.from <= value && value <= rule.to && (value - rule.from) % rule.step === 0)
                    return true;
            }
            else {
                if (rule.step === undefined) {
                    if (rule.value === '*' || rule.value === value)
                        return true;
                }
                else {
                    rule.value = rule.value === '*' ? 0 : rule.value;
                    if ((value - rule.value) % rule.step === 0)
                        return true;
                }   
            }
        }

        return false;
    }
    
    isMatch(dt: DateTime): boolean {
        return CronPattern.isMatchField(this._sec, dt.second) &&
            CronPattern.isMatchField(this._min, dt.minute) &&
            CronPattern.isMatchField(this._hour, dt.hour) &&
            CronPattern.isMatchField(this._day, dt.day) &&
            CronPattern.isMatchField(this._month, dt.month.value) &&
            CronPattern.isMatchField(this._week, dt.weekday.value) &&
            CronPattern.isMatchField(this._year, dt.year);
    }

    get pattern(): string {
        return this._pattern;
    }

    get locale(): Locale {
        return this._locale;
    }

    get sec(): CronRule[] {
        return this._sec;
    }

    get min(): CronRule[] {
        return this._min;
    }

    get hour(): CronRule[] {
        return this._hour;
    }

    get day(): CronRule[] {
        return this._day;
    }

    get month(): CronRule[] {
        return this._month;
    }

    get week(): CronRule[] {
        return this._week;
    }

    get year(): CronRule[] | undefined {
        return this._year;
    }
}