import { getLocale, getLocaleFrom, Locale, LocaleLike } from "../locales";
import { DayOfWeek, DayOfWeekLocaled, Month, MonthLocaled } from "./fields";
import { Interval } from "./interval";
import { Period } from "./period";

const $D = globalThis.Date;

export enum DateField { YEAR, MONTH, DAY, WEEK }

export interface SimpleDate {
    year?: number;
    month?: number;
    day?: number;
    week?: number;
}

function isSimpleDate(obj: any): obj is SimpleDate {
    return obj && typeof obj === "object" &&
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

interface IDate {
    // static
    // now(locale?: LocaleLike): IDate;
    // parse(date: string, locale?: LocaleLike): IDate;

    // getter
    get year(): number;
    get month(): MonthLocaled;
    get day(): number;
    get dayOfMonth(): number;   // alias for `day`
    get dayOfWeek(): DayOfWeekLocaled;
    get dayOfYear(): number;
    get weekOfYear(): number;
    get weekOfMonth(): number;

    // setter
    set year(year: number);
    set month(month: Month | number);
    set day(day: number);

    // method
    toString(format?: string): string;
    toEpochDay(): number;
    isLeapYear(): boolean;
    lengthOfMonth(): number;
    lengthOfYear(): number;

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
    isBefore(date: Date): boolean;
    equals(date: Date): boolean;
    compareTo(date: Date): -1 | 0 | 1;

    until(date: Date): DateInterval;
}

export class Date implements IDate {
    constructor(
        private D: globalThis.Date,
        private locale: Locale = getLocale()
    ) {}

    static now(locale: LocaleLike = getLocale()): Date {
        return new Date(new $D(), getLocaleFrom(locale));
    }

    get year(): number {
        return this.D.getFullYear();
    }

    set year(year: number) {
        this.D.setFullYear(year);
    }
    
    get month(): MonthLocaled {
        return new MonthLocaled(Month.of(this.D.getMonth() + 1), this.locale);
    }

    set month(month: Month | number) {
        this.D.setMonth(typeof month === "number" ? month - 1 : month.value - 1);
    }

    get day(): number {
        return this.D.getDate();
    }

    set day(day: number) {
        this.D.setDate(day);
    }

    get dayOfMonth(): number {
        return this.day;
    }

    get dayOfWeek(): DayOfWeekLocaled {
        return new DayOfWeekLocaled(DayOfWeek.of(this.D.getDay()), this.locale);
    }

    get dayOfYear(): number {
        const current = new $D(this.year, this.month.value - 1, this.day);
        const firstDayOfYear = new $D(this.year, 0, 1);
        return Math.floor((current.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;  // 첫 날을 1로 세기 때문에 +1
    }

    get weekOfYear(): number {
        // ref: https://gist.github.com/IamSilviu/5899269
        const current = new $D(this.year, this.month.value - 1, this.day);
        const firstDayOfYear = new $D(this.year, 0, 1);
        const pastDaysOfYear = (current.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    get weekOfMonth(): number {
        return this.weekOfYear - this.withDay(1).weekOfYear + 1;
    }

    equals(date: Date): boolean {
        return this.year === date.year && this.month === date.month && this.day === date.day;
    }

    isAfter(date: Date): boolean {
        return this.toEpochDay() > date.toEpochDay();
    }

    isBefore(date: Date): boolean {
        return this.toEpochDay() < date.toEpochDay();
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
                .plusDays(value.day)
                .plusWeeks(value.week);
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
        this.D.setDate(this.D.getDate() + value);
        return this;
    }

    plusMonths(value: number): Date {
        this.D.setMonth(this.D.getMonth() + value);
        return this;
    }

    plusWeeks(value: number): Date {
        this.D.setDate(this.D.getDate() + value * 7);
        return this;
    }

    plusYears(value: number): Date {
        this.D.setFullYear(this.D.getFullYear() + value);
        return this;
    }

    minus(value: number, field: DateField): Date;
    minus(obj: SimpleDate): Date;
    minus(period: Period): Date;
    minus(value: number | SimpleDate | Period, field?: DateField): Date {
        if (typeof value === 'number') {
            switch (field) {
                case DateField.YEAR: return this.minusYears(value);
                case DateField.MONTH: return this.minusMonths(value);
                case DateField.DAY: return this.minusDays(value);
                case DateField.WEEK: return this.minusWeeks(value);
                default: throw new TypeError(`Invalid DateField: ${field}`);
            }
        }
        else if (value instanceof Period) {
            return this
                .minusYears(value.year)
                .minusMonths(value.month)
                .minusDays(value.day)
                .minusWeeks(value.week);
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
        this.D.setDate(this.D.getDate() - value);
        return this;
    }

    minusMonths(value: number): Date {
        this.D.setMonth(this.D.getMonth() - value);
        return this;
    }

    minusWeeks(value: number): Date {
        this.D.setDate(this.D.getDate() - value * 7);
        return this;
    }

    minusYears(value: number): Date {
        this.D.setFullYear(this.D.getFullYear() - value);
        return this;
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
        this.D.setFullYear(year);
        return this;
    }

    withMonth(month: Month | number): Date {
        this.D.setMonth(typeof month === "number" ? month - 1 : month.value - 1);
        return this;
    }

    withDay(day: number): Date {
        this.D.setDate(day);
        return this;
    }

    toEpochDay(): number {
        const current = new $D();
        const start = new $D('1970-01-01T00:00:00Z');

        return Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }

    toString(format?: string): string {
        if (format == null)
            return this.locale.dateFormat(String(this.year), String(this.month), String(this.day), this.dayOfWeek.name);

        return format.replace(/DD?|WW?|MM?M?M?|YY(?:YY)?/g, match => {
			switch (match) {
				case 'D':
					return this.day.toString();
				case 'DD':
					return this.day.toString().padStart(2, '0');
				case 'W':
					return this.locale.shortDayOfWeekNames[this.dayOfWeek.value];
				case 'WW':
					return this.locale.dayOfWeekNames[this.dayOfWeek.value]
				case 'M':
					return this.month.toString();
				case 'MM':
					return this.month.toString().padStart(2, '0');
				case 'MMM':
					return this.locale.shortMonthNames[this.month.value];
				case 'MMMM':
					return this.locale.monthNames[this.month.value];
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

export class DateInterval implements Interval {
    constructor(
        public start: Date,
        public end: Date
    ) {
    }

    toPeriod(): Period {
        return new Period();
    }
}
