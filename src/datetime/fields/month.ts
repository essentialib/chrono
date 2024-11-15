import { Locale } from "../../locales";

export type MonthNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export class Month {
    static readonly JANUARY: MonthNumbers = 1;
    static readonly FEBRUARY: MonthNumbers = 2;
    static readonly MARCH: MonthNumbers = 3;
    static readonly APRIL: MonthNumbers = 4;
    static readonly MAY: MonthNumbers = 5;
    static readonly JUNE: MonthNumbers = 6;
    static readonly JULY: MonthNumbers = 7;
    static readonly AUGUST: MonthNumbers = 8;
    static readonly SEPTEMBER: MonthNumbers = 9;
    static readonly OCTOBER: MonthNumbers = 10;
    static readonly NOVEMBER: MonthNumbers = 11;
    static readonly DECEMBER: MonthNumbers = 12;

    constructor(private month: MonthNumbers, private locale: Locale) {
        if (month < 1 || month > 12) {
            throw new Error("Invalid month");
        }
    }

    get value(): MonthNumbers {
        return this.month;
    }

    get name(): string {
        return this.locale.monthNames[this.month];
    }

    get shortName(): string {
        return this.locale.shortMonthNames[this.month];
    }

    valueOf(): MonthNumbers {
        return this.value;
    }
}