import { getLocale, getLocaleFrom, Locale, LocaleLike } from "../locales";
import { Interval } from "../range/interval";
import { Period } from "../range/period";
import { IBase } from "./base";
import { TimeField } from "./fields";

const $D = globalThis.Date;

export type SimpleTime = {
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
}

export function isSimpleTime(obj: any): obj is SimpleTime {
    return obj != null && typeof obj === 'object' &&
        (obj.hour === undefined || typeof obj.hour === "number") &&
        (obj.minute === undefined || typeof obj.minute === "number") &&
        (obj.second === undefined || typeof obj.second === "number") &&
        (obj.millisecond === undefined || typeof obj.millisecond === "number");
}

export interface ITime extends IBase {
    // static
    // now(locale?: LocaleLike): IDate;
    // parse(time: string, locale?: LocaleLike): IDate;

    // FIXME: UTC로 바꿔야 되는거 같음.
    // TODO: toDate()

    // getter
    get hour(): number;
    get minute(): number;
    get second(): number;
    get millisecond(): number;   // alias for `day`
    get ampm(): string;

    // setter
    set hour(hour: number);
    set minute(minute: number);
    set second(second: number);
    set millisecond(ms: number);

    // method
    toString(format?: string): string;
    toMinutes(): number;
    toSeconds(): number;
    toMilliseconds(): number;
    copy(): Time;

    plus(value: number, field: TimeField): Time;
    plus(obj: SimpleTime): Time;
    plus(period: Period): Time;

    plusHours(value: number): Time;
    plusMinutes(value: number): Time;
    plusSeconds(value: number): Time;
    plusMilliseconds(value: number): Time;

    minus(value: number, field: TimeField): Time;
    minus(obj: SimpleTime): Time;
    minus(period: Period): Time;
    minus(time: Time): Period;

    minusHours(value: number): Time;
    minusMinutes(value: number): Time;
    minusSeconds(value: number): Time;
    minusMilliseconds(value: number): Time;

    with(value: number, field: TimeField): Time;
    with(obj: SimpleTime): Time;

    withHour(hour: number): Time;
    withMinute(minute: number): Time;
    withSecond(second: number): Time;
    withMillisecond(ms: number): Time;

    isAfter(time: Time): boolean;
    isAfterOrEquals(time: Time): boolean;
    isBefore(time: Time): boolean;
    isBeforeOrEquals(time: Time): boolean;
    equals(time: Time): boolean;
    compareTo(time: Time): -1 | 0 | 1;

    until(time: Time): TimeInterval;
}

export class Time implements ITime {
    [Symbol.toStringTag] = "Time";

    constructor(
        private D: globalThis.Date,
        private _locale: Locale = getLocale()
    ) {}

    static now(locale: LocaleLike = getLocale()): Time {
        return new Time(new $D(), getLocaleFrom(locale));
    }

    static of(hour: number, minute: number = 0, second: number = 0, ms: number = 0, locale: LocaleLike = getLocale()): Time {
        const D = new $D();
        D.setHours(hour, minute, second, ms);
        
        return new Time(D, getLocaleFrom(locale));
    }

    get locale(): Locale {
        return this._locale;
    }

    get hour(): number {
        return this.D.getHours();
    }

    set hour(hour: number) {
        this.D.setHours(hour);
    }

    get minute(): number {
        return this.D.getMinutes();
    }

    set minute(minute: number) {
        this.D.setMinutes(minute);
    }

    get second(): number {
        return this.D.getSeconds();
    }

    set second(second: number) {
        this.D.setSeconds(second);
    }

    get millisecond(): number {
        return this.D.getMilliseconds();
    }

    set millisecond(ms: number) {
        this.D.setMilliseconds(ms);
    }

    get ampm(): string {
        return this._locale.ampm[+(this.hour >= 12)];
    }

    get(field: TimeField): number {
        switch (field) {
            case TimeField.HOUR: return this.hour;
            case TimeField.MINUTE: return this.minute;
            case TimeField.SECOND: return this.second;
            case TimeField.MILLISECOND: return this.millisecond;
            default: throw new TypeError(`Invalid DateField: ${field}`);
        }
    }

    toMinutes(): number {
        return this.hour * 60 + this.minute;
    }

    toSeconds(): number {
        return this.toMinutes() * 60 + this.second;
    }

    toMilliseconds(): number {
        return this.toSeconds() * 1000 + this.millisecond;
    }

    static fromMilliseconds(ms: number, locale: LocaleLike = getLocale()): Time {
        const hour = Math.floor(ms / 3600000);
        ms %= 3600000;
        const minute = Math.floor(ms / 60000);
        ms %= 60000;
        const second = Math.floor(ms / 1000);
        ms %= 1000;

        return new Time(new $D(0, 0, 0, hour, minute, second, ms), getLocaleFrom(locale));
    }

    equals(time: Time): boolean {
        return this.hour === time.hour && this.minute === time.minute && this.second === time.second && this.millisecond === time.millisecond;
    }

    isAfter(time: Time): boolean {
        return this.toMilliseconds() > time.toMilliseconds();
    }

    isAfterOrEquals(time: Time): boolean {
        return this.toMilliseconds() >= time.toMilliseconds();
    }

    isBefore(time: Time): boolean {
        return this.toMilliseconds() < time.toMilliseconds();
    }

    isBeforeOrEquals(time: Time): boolean {
        return this.toMilliseconds() <= time.toMilliseconds();
    }

    compareTo(time: Time): -1 | 0 | 1 {
        return this.isBefore(time) ? -1 : this.equals(time) ? 0 : 1;
    }

    copy(): Time {
        return new Time(new $D(this.D), this._locale);
    }

    plus(value: number, field: TimeField): Time;
    plus(obj: SimpleTime): Time;
    plus(period: Period): Time;
    plus(value: number | SimpleTime | Period, field?: TimeField): Time {
        if (typeof value === 'number') {
            switch (field) {
                case TimeField.HOUR: return this.plusHours(value);
                case TimeField.MINUTE: return this.plusMinutes(value);
                case TimeField.SECOND: return this.plusSeconds(value);
                case TimeField.MILLISECOND: return this.plusMilliseconds(value);
                default: throw new TypeError(`Invalid DateField: ${field}`);
            }
        }
        else if (value instanceof Period) {
            return this
                .plusHours(value.hour)
                .plusMinutes(value.minute)
                .plusSeconds(value.second)
                .plusMilliseconds(value.millisecond);
        }
        else if (isSimpleTime(value)) {
            return this
                .plusHours(value.hour ?? 0)
                .plusMinutes(value.minute ?? 0)
                .plusSeconds(value.second ?? 0)
                .plusMilliseconds(value.millisecond ?? 0);
        }
        else {
            throw new TypeError(`Invalid argument: ${value}`);
        }
    }

    plusHours(value: number): Time {
        const ret = this.copy();
        ret.D.setHours(ret.D.getHours() + value);
        return ret;
    }

    plusMinutes(value: number): Time {
        const ret = this.copy();
        ret.D.setMinutes(ret.D.getMinutes() + value);
        return ret;
    }

    plusSeconds(value: number): Time {
        const ret = this.copy();
        ret.D.setSeconds(ret.D.getSeconds() + value);
        return ret;
    }

    plusMilliseconds(value: number): Time {
        const ret = this.copy();
        ret.D.setMilliseconds(ret.D.getMilliseconds() + value);
        return ret;
    }

    minus(value: number, field: TimeField): Time;
    minus(obj: SimpleTime): Time;
    minus(period: Period): Time;
    minus(time: Time): Period;
    minus(value: number | SimpleTime | Period | Time, field?: TimeField): Time | Period {
        if (typeof value === 'number') {
            switch (field) {
                case TimeField.HOUR: return this.minusHours(value);
                case TimeField.MINUTE: return this.minusMinutes(value);
                case TimeField.SECOND: return this.minusSeconds(value);
                case TimeField.MILLISECOND: return this.minusMilliseconds(value);
                default: throw new TypeError(`Invalid DateField: ${field}`);
            }
        }
        else if (value instanceof Time) {
            const diff = this.toMilliseconds() - value.toMilliseconds();
            const diffTime = Time.fromMilliseconds(Math.abs(diff));

            return new Period(
                0,
                0,
                0,
                diff >= 0 ? diffTime.hour : -diffTime.hour,
                diff >= 0 ? diffTime.minute : -diffTime.minute,
                diff >= 0 ? diffTime.second : -diffTime.second,
                diff >= 0 ? diffTime.millisecond : -diffTime.millisecond
            );
        }
        else if (value instanceof Period) {
            return this
                .minusHours(value.hour)
                .minusMinutes(value.minute)
                .minusSeconds(value.second)
                .minusMilliseconds(value.millisecond);
        }
        else if (isSimpleTime(value)) {
            return this
                .minusHours(value.hour ?? 0)
                .minusMinutes(value.minute ?? 0)
                .minusSeconds(value.second ?? 0)
                .minusMilliseconds(value.millisecond ?? 0);
        }
        else {
            throw new TypeError(`Invalid argument: ${value}`);
        }
    }

    minusHours(value: number): Time {
        const ret = this.copy();
        ret.D.setHours(ret.D.getHours() - value);
        return ret;
    }

    minusMinutes(value: number): Time {
        const ret = this.copy();
        ret.D.setMinutes(ret.D.getMinutes() - value);
        return ret;
    }

    minusSeconds(value: number): Time {
        const ret = this.copy();
        ret.D.setSeconds(ret.D.getSeconds() - value);
        return ret
    }

    minusMilliseconds(value: number): Time {
        const ret = this.copy();
        ret.D.setMilliseconds(ret.D.getMilliseconds() - value);
        return ret;
    }

    with(value: number, field: TimeField): Time;
    with(obj: SimpleTime): Time;
    with(value: number | SimpleTime, field?: TimeField): Time {
        if (typeof value === 'number') {
            switch (field) {
                case TimeField.HOUR: return this.withHour(value);
                case TimeField.MINUTE: return this.withMinute(value);
                case TimeField.SECOND: return this.withSecond(value);
                case TimeField.MILLISECOND: return this.withMillisecond(value);
                default: throw new TypeError(`Invalid DateField: ${field}`);
            }
        }
        else if (isSimpleTime(value)) {
            return this
                .withHour(value.hour ?? this.hour)
                .withMinute(value.minute ?? this.minute)
                .withSecond(value.second ?? this.second)
                .withMillisecond(value.millisecond ?? this.millisecond);
        }
        else {
            throw new TypeError(`Invalid argument: ${value}`);
        }
    }

    withHour(value: number): Time {
        const ret = this.copy();
        ret.D.setHours(value);
        return ret;
    }

    withMinute(value: number): Time {
        const ret = this.copy();
        ret.D.setMinutes(value);
        return ret;
    }

    withSecond(value: number): Time {
        const ret = this.copy();
        ret.D.setSeconds(value);
        return ret;
    }

    withMillisecond(value: number): Time {
        const ret = this.copy();
        ret.D.setMilliseconds(value);
        return ret;
    }

    toString(format?: string): string {
        if (format == null)
            return this._locale.timeFormat(String(this.hour), String(this.minute), String(this.second), String(this.millisecond));

        return format.replace(/ss?s?|mm?|hh?|ii?|t/g, match => {
            switch (match) {
                case 's':
                    return this.second.toString();
                case 'ss':
                    return this.second.toString().padStart(2, '0');
                case 'sss':
                    return this.millisecond.toString();
                case 'm':
                    return this.minute.toString();
                case 'mm':
                    return this.minute.toString().padStart(2, '0');
                case 'h':
                    return (this.hour === 12 ? 12 : this.hour % 12).toString();
                case 'hh':
                    return (this.hour === 12 ? 12 : this.hour % 12).toString().padStart(2, '0');
                case 'i':
                    return this.hour.toString();
                case 'ii':
                    return this.hour.toString().padStart(2, '0');
                case 't':
                    return this.ampm;
                default:
                    throw new Error(`unknown format ${match}`);
            }
        });
    }
    
    until(time: Time): TimeInterval {
        return new TimeInterval(this, time);
    }
}

export class TimeInterval extends Interval<Time, TimeField> {
    constructor(start: Time, end: Time) {
        super(start, end);
    }

    toPeriod(): Period {
        // @ts-ignore
        return this.end.minus(this.start);
    }

    range(field: TimeField): Time[] {
        const ret = [];
        let current = this.start.copy();

        while (current.isBeforeOrEquals(this.end)) {
            ret.push(current);
            current = current.plus(1, field);
        }

        return ret;
    }
}
