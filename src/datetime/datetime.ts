import { Locale, LocaleLike, getLocale, getLocaleFrom } from "../locales";
import { Interval } from "../range/interval";
import { Period } from "../range/period";
import { Date, SimpleDate, isSimpleDate } from "./date";
import { Time, SimpleTime, isSimpleTime } from "./time";
import { Month, MonthNumbers, Weekday, DateTimeField } from "./fields";
import { IBase } from "./base";

const $D = globalThis.Date;

export type SimpleDateTime = SimpleDate & SimpleTime;

function isSimpleDateTime(obj: any): obj is SimpleDateTime {
    return isSimpleDate(obj) && isSimpleTime(obj);
}

export class DateTime implements IBase {
    [Symbol.toStringTag] = "DateTime";

    constructor(
        private _date: Date,
        private _time: Time,
        private _locale: Locale = getLocale()
    ) {}

    static now(locale: LocaleLike = getLocale()): DateTime {
        const loc = getLocaleFrom(locale);
        const now = new $D();
        return new DateTime(new Date(now, loc), new Time(now, loc), loc);
    }

    static of(
        year: number,
        month: Month | MonthNumbers = 1,
        day: number = 1,
        hour: number = 0,
        minute: number = 0,
        second: number = 0,
        ms: number = 0,
        locale: LocaleLike = getLocale()
    ): DateTime {
        const loc = getLocaleFrom(locale);

        return new DateTime(
            Date.of(year, month, day, loc),
            Time.of(hour, minute, second, ms, loc),
            loc
        );
    }

    static today(locale: LocaleLike = getLocale()): DateTime {
        const loc = getLocaleFrom(locale);
        const today = new $D();
        today.setHours(0, 0, 0, 0);
        return new DateTime(new Date(today, loc), new Time(today, loc), loc);
    }

    // TODO: util functions

    get locale(): Locale {
        return this._locale;
    }

    get date(): Date {
        return this._date;
    }

    set date(date: Date) {
        this._date = date;
    }

    get time(): Time {
        return this._time;
    }

    set time(time: Time) {
        this._time = time;
    }

    get year(): number {
        return this._date.year;
    }

    set year(year: number) {
        this._date.year = year;
    }

    get month(): Month {
        return this._date.month;
    }

    set month(month: Month | MonthNumbers) {
        this._date.month = month;
    }

    get day(): number {
        return this._date.day;
    }

    set day(day: number) {
        this._date.day = day;
    }

    get weekday(): Weekday {
        return this._date.weekday;
    }

    // set weekday()

    get hour(): number {
        return this._time.hour;
    }

    set hour(hour: number) {
        this._time.hour = hour;
    }

    get minute(): number {
        return this._time.minute;
    }

    set minute(minute: number) {
        this._time.minute = minute;
    }

    get second(): number {
        return this._time.second;
    }

    set second(second: number) {
        this._time.second = second;
    }

    get millisecond(): number {
        return this._time.millisecond;
    }

    set millisecond(ms: number) {
        this._time.millisecond = ms;
    }

    get ampm(): string {
        return this._time.ampm;
    }

    get(field: DateTimeField): number | Month | Weekday {
        switch (field) {
            case DateTimeField.YEAR: return this.year;
            case DateTimeField.MONTH: return this.month;
            case DateTimeField.DAY: return this.day;
            case DateTimeField.WEEK: return this.weekday;
            case DateTimeField.HOUR: return this.hour;
            case DateTimeField.MINUTE: return this.minute;
            case DateTimeField.SECOND: return this.second;
            case DateTimeField.MILLISECOND: return this.millisecond;
            default: throw new TypeError(`Invalid DateTimeField: ${field}`);
        }
    }

    atStartOfDay(): DateTime {
        return this.withHour(0).withMinute(0).withSecond(0).withMillisecond(0);
    }

    midnight(): DateTime {
        const today = new $D(this.year, this.month.value - 1, this.day, 0, 0, 0, 0);
        return new DateTime(new Date(today, this._locale), new Time(today, this._locale), this._locale);
    }

    timestamp(): number {
        const amount = ((this.hour * 60 + this.minute) * 60 + this.second) * 1000 + this.millisecond;
        const today = new $D(this.year, this.month.value - 1, this.day, 0, 0, 0, 0);
        return today.getTime() + amount;
    }

    static fromTimestamp(timestamp: number, locale: LocaleLike = getLocale()): DateTime {
        const loc = getLocaleFrom(locale);
        const date = new $D(timestamp);
        return new DateTime(new Date(date, loc), new Time(date, loc), loc);
    }

    isAfter(datetime: DateTime): boolean {
        return this.timestamp() > datetime.timestamp();
    }

    isAfterOrEquals(datetime: DateTime): boolean {
        return this.timestamp() >= datetime.timestamp();
    }

    isBefore(datetime: DateTime): boolean {
        return this.timestamp() < datetime.timestamp();
    }

    isBeforeOrEquals(datetime: DateTime): boolean {
        return this.timestamp() <= datetime.timestamp();
    }

    equals(datetime: DateTime): boolean {
        return this.timestamp() === datetime.timestamp();
    }

    compareTo(datetime: DateTime): -1 | 0 | 1 {
        return this.isBefore(datetime) ? -1 : this.equals(datetime) ? 0 : 1;
    }

    dayOfYear(): number {
        return this._date.dayOfYear();
    }

    weekOfYear(): number {
        return this._date.weekOfYear();
    }

    weekOfMonth(): number {
        return this._date.weekOfMonth();
    }

    isLeapYear(): boolean {
        return this._date.isLeapYear();
    }

    lengthOfMonth(): number {
        return this._date.lengthOfMonth();
    }

    lengthOfYear(): number {
        return this._date.lengthOfYear();
    }

    copy(): DateTime {
        return new DateTime(this._date.copy(), this._time.copy(), this._locale);
    }

    plus(value: number, field: DateTimeField): DateTime;
    plus(obj: SimpleDateTime): DateTime;
    plus(period: Period): DateTime;
    plus(value: number | SimpleDateTime | Period, field?: DateTimeField): DateTime {
        if (typeof value === 'number') {
            switch (field) {
                case DateTimeField.YEAR: return this.plusYears(value);
                case DateTimeField.MONTH: return this.plusMonths(value);
                case DateTimeField.DAY: return this.plusDays(value);
                case DateTimeField.WEEK: return this.plusWeeks(value);
                case DateTimeField.HOUR: return this.plusHours(value);
                case DateTimeField.MINUTE: return this.plusMinutes(value);
                case DateTimeField.SECOND: return this.plusSeconds(value);
                case DateTimeField.MILLISECOND: return this.plusMilliseconds(value);
                default: throw new TypeError(`Invalid DateTimeField: ${field}`);
            }
        }
        else if (value instanceof Period) {
            return this
                .plusYears(value.year)
                .plusMonths(value.month)
                .plusDays(value.day)
                .plusHours(value.hour)
                .plusMinutes(value.minute)
                .plusSeconds(value.second)
                .plusMilliseconds(value.millisecond);
        }
        else if (isSimpleDateTime(value)) {
            return this
                .plusYears(value.year ?? 0)
                .plusMonths(value.month ?? 0)
                .plusDays(value.day ?? 0)
                .plusWeeks(value.week ?? 0)
                .plusHours(value.hour ?? 0)
                .plusMinutes(value.minute ?? 0)
                .plusSeconds(value.second ?? 0)
                .plusMilliseconds(value.millisecond ?? 0);
        }
        else {
            throw new TypeError(`Invalid argument: ${value}`);
        }
    }

    plusYears(value: number): DateTime {
        const ret = this.copy();
        ret.date.plusYears(value);
        return ret;
    }

    plusMonths(value: number): DateTime {
        const ret = this.copy();
        ret.date.plusMonths(value);
        return ret;
    }

    plusDays(value: number): DateTime {
        const ret = this.copy();
        ret.date.plusDays(value);
        return ret
    }

    plusWeeks(value: number): DateTime {
        const ret = this.copy();
        ret.date.plusWeeks(value);
        return ret;
    }

    plusHours(value: number): DateTime {
        const ret = this.copy();
        ret.time.plusHours(value);
        return ret;
    }

    plusMinutes(value: number): DateTime {
        const ret = this.copy();
        ret.time.plusMinutes(value);
        return ret;
    }

    plusSeconds(value: number): DateTime {
        const ret = this.copy();
        ret.time.plusSeconds(value);
        return ret;
    }

    plusMilliseconds(value: number): DateTime {
        const ret = this.copy();
        ret.time.plusMilliseconds(value);
        return ret;
    }

    minus(value: number, field: DateTimeField): DateTime;
    minus(obj: SimpleDateTime): DateTime;
    minus(period: Period): DateTime;
    minus(datetime: DateTime): Period;
    minus(value: number | SimpleDateTime | Period | DateTime, field?: DateTimeField): DateTime | Period {
        if (typeof value === 'number') {
            switch (field) {
                case DateTimeField.YEAR: return this.minusYears(value);
                case DateTimeField.MONTH: return this.minusMonths(value);
                case DateTimeField.DAY: return this.minusDays(value);
                case DateTimeField.WEEK: return this.minusWeeks(value);
                case DateTimeField.HOUR: return this.minusHours(value);
                case DateTimeField.MINUTE: return this.minusMinutes(value);
                case DateTimeField.SECOND: return this.minusSeconds(value);
                case DateTimeField.MILLISECOND: return this.minusMilliseconds(value);
                default: throw new TypeError(`Invalid DateTimeField: ${field}`);
            }
        }
        else if (value instanceof DateTime) {
            const diff = this.timestamp() - value.timestamp();
            const diffDT = DateTime.fromTimestamp(diff);

            return new Period(
                diff >= 0 ? diffDT.year : -diffDT.year,
                diff >= 0 ? diffDT.month.value : -diffDT.month.value,
                diff >= 0 ? diffDT.day : -diffDT.day,
                diff >= 0 ? diffDT.hour : -diffDT.hour,
                diff >= 0 ? diffDT.minute : -diffDT.minute,
                diff >= 0 ? diffDT.second : -diffDT.second,
                diff >= 0 ? diffDT.millisecond : -diffDT.millisecond
            );
        }
        else if (value instanceof Period) {
            return this
                .minusYears(value.year)
                .minusMonths(value.month)
                .minusDays(value.day)
                .minusHours(value.hour)
                .minusMinutes(value.minute)
                .minusSeconds(value.second)
                .minusMilliseconds(value.millisecond);
        }
        else if (isSimpleDateTime(value)) {
            return this
                .minusYears(value.year ?? 0)
                .minusMonths(value.month ?? 0)
                .minusDays(value.day ?? 0)
                .minusWeeks(value.week ?? 0)
                .minusHours(value.hour ?? 0)
                .minusMinutes(value.minute ?? 0)
                .minusSeconds(value.second ?? 0)
                .minusMilliseconds(value.millisecond ?? 0);
        }
        else {
            throw new TypeError(`Invalid argument: ${value}`);
        }
    }

    minusYears(value: number): DateTime {
        const ret = this.copy();
        ret.date.minusYears(value);
        return ret;
    }

    minusMonths(value: number): DateTime {
        const ret = this.copy();
        ret.date.minusMonths(value);
        return ret;
    }

    minusDays(value: number): DateTime {
        const ret = this.copy();
        ret.date.minusDays(value);
        return ret;
    }

    minusWeeks(value: number): DateTime {
        const ret = this.copy();
        ret.date.minusWeeks(value);
        return ret;
    }

    minusHours(value: number): DateTime {
        const ret = this.copy();
        ret.time.minusHours(value);
        return ret;
    }

    minusMinutes(value: number): DateTime {
        const ret = this.copy();
        ret.time.minusMinutes(value);
        return ret;
    }

    minusSeconds(value: number): DateTime {
        const ret = this.copy();
        ret.time.minusSeconds(value);
        return ret;
    }

    minusMilliseconds(value: number): DateTime {
        const ret = this.copy();
        ret.time.minusMilliseconds(value);
        return ret;
    }

    with(value: number, field: Exclude<DateTimeField, DateTimeField.WEEK>): DateTime;
    with(obj: Omit<SimpleDateTime, 'week'>): DateTime;
    with(value: number | Omit<SimpleDateTime, 'week'>, field?: Exclude<DateTimeField, DateTimeField.WEEK>): DateTime {
        if (typeof value === 'number') {
            switch (field) {
                case DateTimeField.YEAR: return this.withYear(value);
                case DateTimeField.MONTH: return this.withMonth(value);
                case DateTimeField.DAY: return this.withDay(value);
                case DateTimeField.HOUR: return this.withHour(value);
                case DateTimeField.MINUTE: return this.withMinute(value);
                case DateTimeField.SECOND: return this.withSecond(value);
                case DateTimeField.MILLISECOND: return this.withMillisecond(value);
                default: throw new TypeError(`Invalid DateTimeField: ${field}`);
            }
        }
        else if (isSimpleDateTime(value)) {
            return this
                .withYear(value.year ?? this.year)
                .withMonth(value.month ?? this.month.value)
                .withDay(value.day ?? this.day)
                .withHour(value.hour ?? this.hour)
                .withMinute(value.minute ?? this.minute)
                .withSecond(value.second ?? this.second)
                .withMillisecond(value.millisecond ?? this.millisecond);
        }
        else {
            throw new TypeError(`Invalid argument: ${value}`);
        }
    }

    withYear(value: number): DateTime {
        const ret = this.copy();
        ret.date.withYear(value);
        return ret;
    }

    withMonth(value: Month | number): DateTime {
        const ret = this.copy();
        ret.date.withMonth(value);
        return ret;
    }

    withDay(value: number): DateTime {
        const ret = this.copy();
        ret.date.withDay(value);
        return ret;
    }

    withHour(value: number): DateTime {
        const ret = this.copy();
        ret.time.withHour(value);
        return ret;
    }

    withMinute(value: number): DateTime {
        const ret = this.copy();
        ret.time.withMinute(value);
        return ret;
    }

    withSecond(value: number): DateTime {
        const ret = this.copy();
        ret.time.withSecond(value);
        return ret;
    }

    withMillisecond(value: number): DateTime {
        const ret = this.copy();
        ret.time.withMillisecond(value);
        return ret;
    }

    toString(format?: string): string {
        if (format == null)
            return this._locale.dateTimeFormat(String(this.year), String(this.month), String(this.day), this.weekday.name, String(this.hour), String(this.minute), String(this.second), String(this.millisecond));

        return format.replace(/ss?s?|mm?|hh?|ii?|t|DD?|WW?|MM?M?M?|YY(?:YY)?/g, match => {
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
                case 'D':
                    return this.day.toString();
                case 'DD':
                    return this.day.toString().padStart(2, '0');
                case 'W':
                    return this.weekday.shortName;
                case 'WW':
                    return this.weekday.name;
                case 'M':
                    return this.month.value.toString();
                case 'MM':
                    return this.month.value.toString().padStart(2, '0');
                case 'MMM':
                    return this.month.shortName;
                case 'MMMM':
                    return this.month.name;
                case 'YY':
                    return (this.year % 100).toString();
                case 'YYYY':
                    return this.year.toString();
                default:
                    throw new Error(`unknown format ${match}`);
            }
        });
    }

    until(datetime: DateTime): DateTimeInterval {
        return new DateTimeInterval(this, datetime);
    }
}

export class DateTimeInterval extends Interval<DateTime, DateTimeField> {
    constructor(start: DateTime, end: DateTime) {
        super(start, end);
    }

    toPeriod(): Period {
        return this.end.minus(this.start);
    }

    range(field: DateTimeField): DateTime[] {
        const ret: DateTime[] = [];
        let current = this.start.copy();

        while (current.isBeforeOrEquals(this.end)) {
            ret.push(current);
            current = current.plus(1, field);
        }
        
        return ret;
    }
}
