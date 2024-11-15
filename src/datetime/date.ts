import { getLocale, getLocaleFrom, Locale, LocaleLike } from "../locales";
import { Weekday, Month, MonthNumbers, WeekdayNumbers, DateField } from "./fields";
import { Interval } from "../range/interval";
import { Period } from "../range/period";
import { IBase } from "./base";

const $D = globalThis.Date;

export type SimpleDate = {
    year?: number;
    month?: number;
    day?: number;
    week?: number;
}

export function isSimpleDate(obj: any): obj is SimpleDate {
    return obj != null && typeof obj === "object" &&
        (obj.year === undefined || typeof obj.year === "number") &&
        (obj.month === undefined || typeof obj.month === "number") &&
        (obj.day === undefined || typeof obj.day === "number") &&
        (obj.week === undefined || typeof obj.week === "number");
}

function isSimpleDateWithoutWeek(obj: any): obj is Omit<SimpleDate, "week"> {
    return obj && typeof obj === "object" &&
        (obj.year === undefined || typeof obj.year === "number") &&
        (obj.month === undefined || typeof obj.month === "number") &&
        (obj.day === undefined || typeof obj.day === "number");
}

export interface IDate extends IBase {
    // static
    // now(locale?: LocaleLike): IDate;
    // parse(date: string, locale?: LocaleLike): IDate;

    // getter
    get year(): number;
    get month(): Month;
    get day(): number;
    get weekday(): Weekday;

    // setter
    set year(year: number);
    set month(month: Month | MonthNumbers);
    set day(day: number);

    // method
    toString(format?: string): string;
    toEpochDay(): number;
    dayOfYear(): number;
    weekOfYear(): number;
    weekOfMonth(): number;
    isLeapYear(): boolean;
    lengthOfMonth(): number;
    lengthOfYear(): number;
    copy(): Date;

    plus(value: number, field: DateField): Date;
    plus(obj: SimpleDate): Date;
    plus(period: Period): Date;

    plusYears(value: number): Date;
    plusMonths(value: number): Date;
    plusDays(value: number): Date;
    plusWeeks(value: number): Date;

    minus(value: number, field: DateField): Date;
    minus(obj: SimpleDate): Date;
    minus(period: Period): Date;
    minus(date: Date): Period;

    minusYears(value: number): Date;
    minusMonths(value: number): Date;
    minusDays(value: number): Date;
    minusWeeks(value: number): Date;

    with(value: number, field: Exclude<DateField, DateField.WEEK>): Date;
    with(obj: Omit<SimpleDate, 'week'>): Date;

    withYear(year: number): Date;
    withMonth(month: Month | number): Date;
    withDay(day: number): Date;

    isAfter(date: Date): boolean;
    isAfterOrEquals(date: Date): boolean;
    isBefore(date: Date): boolean;
    isBeforeOrEquals(date: Date): boolean;
    equals(date: Date): boolean;
    compareTo(date: Date): -1 | 0 | 1;

    until(date: Date): DateInterval;
}

export class Date implements IDate {
    [Symbol.toStringTag] = "Date";

    constructor(
        private D: globalThis.Date,
        private _locale: Locale = getLocale()
    ) {}

    static now(locale: LocaleLike = getLocale()): Date {
        return new Date(new $D(), getLocaleFrom(locale));
    }

    static of(year: number, month: Month | MonthNumbers = 1, day: number = 1, locale: LocaleLike = getLocale()): Date {
        return new Date(
            new $D(
                year,
                typeof month === "number" ? month - 1 : month.value - 1,
                day
            ),
            getLocaleFrom(locale)
        );
    }

    static fromEpochDay(epochDay: number, locale: LocaleLike = getLocale()): Date {
        const start = new $D(0);
        const current = new $D(start.getTime() + epochDay * 1000 * 60 * 60 * 24);

        return new Date(current, getLocaleFrom(locale));
    }

    get locale(): Locale {
        return this.locale;
    }

    get year(): number {
        return this.D.getFullYear();
    }

    set year(year: number) {
        this.D.setFullYear(year);
    }
    
    get month(): Month {
        return new Month((this.D.getMonth() + 1) as MonthNumbers, this._locale);
    }

    set month(month: Month | MonthNumbers) {
        this.D.setMonth(typeof month === "number" ? month - 1 : month.value - 1);
    }

    get day(): number {
        return this.D.getDate();
    }

    set day(day: number) {
        this.D.setDate(day);
    }

    get weekday(): Weekday {
        return new Weekday(this.D.getDay() as WeekdayNumbers, this._locale);
    }

    get(field: DateField): number | Month | Weekday {
        switch (field) {
            case DateField.YEAR: return this.year;
            case DateField.MONTH: return this.month;
            case DateField.DAY: return this.day;
            case DateField.WEEK: return this.weekday;
            default: throw new TypeError(`Invalid DateField: ${field}`);
        }
    }

    dayOfYear(): number {
        const current = new $D(this.year, this.month.value - 1, this.day);
        const firstDayOfYear = new $D(this.year, 0, 1);
        return Math.floor((current.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;  // 첫 날을 1로 세기 때문에 +1
    }

    weekOfYear(): number {
        // ref: https://gist.github.com/IamSilviu/5899269
        const current = new $D(this.year, this.month.value - 1, this.day);
        const firstDayOfYear = new $D(this.year, 0, 1);
        const pastDaysOfYear = (current.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    weekOfMonth(): number {
        return this.weekOfYear() - this.withDay(1).weekOfYear() + 1;
    }

    equals(date: Date): boolean {
        return this.year === date.year && this.month === date.month && this.day === date.day;
    }

    isAfter(date: Date): boolean {
        return this.toEpochDay() > date.toEpochDay();
    }

    isAfterOrEquals(date: Date): boolean {
        return this.toEpochDay() >= date.toEpochDay();
    }

    isBefore(date: Date): boolean {
        return this.toEpochDay() < date.toEpochDay();
    }

    isBeforeOrEquals(date: Date): boolean {
        return this.toEpochDay() <= date.toEpochDay();
    }

    compareTo(date: Date): -1 | 0 | 1 {
        return this.isBefore(date) ? -1 : this.equals(date) ? 0 : 1;
    }

    isLeapYear(): boolean {
        return (this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0;
    }

    lengthOfMonth(): number {
        return [NaN, 31, this.isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][this.month.value];
    }

    lengthOfYear(): number {
        return this.isLeapYear() ? 366 : 365;
    }

    copy(): Date {
        return new Date(new $D(this.D), this._locale);
    }

    plus(value: number, field: DateField): Date;
    plus(obj: SimpleDate): Date;
    plus(period: Period): Date;
    plus(value: number | SimpleDate | Period, field?: DateField): Date {
        if (typeof value === 'number') {
            switch (field) {
                case DateField.YEAR: return this.plusYears(value);
                case DateField.MONTH: return this.plusMonths(value);
                case DateField.DAY: return this.plusDays(value);
                case DateField.WEEK: return this.plusWeeks(value);
                default: throw new TypeError(`Invalid DateField: ${field}`);
            }
        }
        else if (value instanceof Period) {
            return this
                .plusYears(value.year)
                .plusMonths(value.month)
                .plusDays(value.day);
        }
        else if (isSimpleDate(value)) {
            return this
                .plusYears(value.year ?? 0)
                .plusMonths(value.month ?? 0)
                .plusDays(value.day ?? 0)
                .plusWeeks(value.week ?? 0);
        }
        else {
            throw new TypeError(`Invalid argument: ${value}`);
        }
    }

    plusDays(value: number): Date {
        const ret = this.copy();
        ret.D.setDate(ret.D.getDate() + value);
        return ret;
    }

    plusMonths(value: number): Date {
        const ret = this.copy();
        ret.D.setMonth(ret.D.getMonth() + value);
        return ret;
    }

    plusWeeks(value: number): Date {
        const ret = this.copy();
        ret.D.setDate(ret.D.getDate() + value * 7);
        return ret;
    }

    plusYears(value: number): Date {
        const ret = this.copy();
        ret.D.setFullYear(ret.D.getFullYear() + value);
        return ret
    }

    minus(value: number, field: DateField): Date;
    minus(obj: SimpleDate): Date;
    minus(period: Period): Date;
    minus(date: Date): Period;
    minus(value: number | SimpleDate | Period | Date, field?: DateField): Date | Period {
        if (typeof value === 'number') {
            switch (field) {
                case DateField.YEAR: return this.minusYears(value);
                case DateField.MONTH: return this.minusMonths(value);
                case DateField.DAY: return this.minusDays(value);
                case DateField.WEEK: return this.minusWeeks(value);
                default: throw new TypeError(`Invalid DateField: ${field}`);
            }
        }
        else if (value instanceof Date) {
            const diff = this.toEpochDay() - value.toEpochDay();
            const diffDate = Date.fromEpochDay(Math.abs(diff));

            return new Period(
                diff >= 0 ? diffDate.year : -diffDate.year,
                diff >= 0 ? diffDate.month.value : -diffDate.month.value,
                diff >= 0 ? diffDate.day : -diffDate.day,
                0,
                0,
                0,
                0
            );
        }
        else if (value instanceof Period) {
            return this
                .minusYears(value.year)
                .minusMonths(value.month)
                .minusDays(value.day);
        }
        else if (isSimpleDate(value)) {
            return this
                .minusYears(value.year ?? 0)
                .minusMonths(value.month ?? 0)
                .minusDays(value.day ?? 0)
                .minusWeeks(value.week ?? 0);
        }
        else {
            throw new TypeError(`Invalid argument: ${value}`);
        }
    }

    minusDays(value: number): Date {
        const ret = this.copy();
        ret.D.setDate(ret.D.getDate() - value);
        return ret;
    }

    minusMonths(value: number): Date {
        const ret = this.copy();
        ret.D.setMonth(ret.D.getMonth() - value);
        return ret;
    }

    minusWeeks(value: number): Date {
        const ret = this.copy();
        ret.D.setDate(ret.D.getDate() - value * 7);
        return ret;
    }

    minusYears(value: number): Date {
        const ret = this.copy();
        ret.D.setFullYear(ret.D.getFullYear() - value);
        return ret;
    }

    with(value: number, field: Exclude<DateField, DateField.WEEK>): Date;
    with(obj: Omit<SimpleDate, "week">): Date;
    with(value: number | Omit<SimpleDate, "week">, field?: Exclude<DateField, DateField.WEEK>): Date {
        if (typeof value === "number") {
            switch (field) {
                case DateField.YEAR: return this.withYear(value);
                case DateField.MONTH: return this.withMonth(value);
                case DateField.DAY: return this.withDay(value);
                default: throw new TypeError(`Invalid DateField: ${field}`);
            }
        }
        else if (isSimpleDateWithoutWeek(value)) {
            return this
                .withYear(value.year ?? this.year)
                .withMonth(value.month ?? this.month.value)
                .withDay(value.day ?? this.day);
        }
        else {
            throw new TypeError(`Invalid argument: ${value}`);
        }
    }

    withYear(year: number): Date {
        const ret = this.copy();
        ret.D.setFullYear(year);
        return ret;
    }

    withMonth(month: Month | number): Date {
        const ret = this.copy();
        ret.D.setMonth(typeof month === "number" ? month - 1 : month.value - 1);
        return ret;
    }

    withDay(day: number): Date {
        const ret = this.copy();
        ret.D.setDate(day);
        return ret;
    }

    toEpochDay(): number {
        const start = new $D(0);
        const current = new $D();

        return Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }

    toString(format?: string): string {
        if (format == null)
            return this._locale.dateFormat(String(this.year), String(this.month), String(this.day), this.weekday.name);

        return format.replace(/DD?|WW?|MM?M?M?|YY(?:YY)?/g, match => {
			switch (match) {
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

    until(date: Date): DateInterval {
        return new DateInterval(this, date);
    }
}

export class DateInterval extends Interval<Date, DateField> {
    constructor(start: Date, end: Date) {
        super(start, end);
    }

    toPeriod(): Period {
        return this.end.minus(this.start);
    }
    
    range(field: DateField): Date[] {
        const ret: Date[] = [];
        let current = this.start.copy();

        while (current.isBeforeOrEquals(this.end)) {
            ret.push(current);
            current = current.plus(1, field);
        }

        return ret;
    }
}
