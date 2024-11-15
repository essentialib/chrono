import { Locale } from "../../locales";

export type WeekdayNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export class Weekday {
    static readonly SUNDAY: WeekdayNumbers = 0;
    static readonly MONDAY: WeekdayNumbers = 1;
    static readonly TUESDAY: WeekdayNumbers = 2;
    static readonly WEDNESDAY: WeekdayNumbers = 3;
    static readonly THURSDAY: WeekdayNumbers = 4;
    static readonly FRIDAY: WeekdayNumbers = 5;
    static readonly SATURDAY: WeekdayNumbers = 6;

    constructor(private weekday: WeekdayNumbers, private locale: Locale) {
        if (weekday < 0 || weekday > 6) {
            throw new Error("Invalid weekday");
        }
    }

    get value(): WeekdayNumbers {
        return this.weekday;
    }

    get name(): string {
        return this.locale.weekdayNames[this.weekday];
    }

    get shortName(): string {
        return this.locale.shortWeekdayNames[this.weekday];
    }

    valueOf(): WeekdayNumbers {
        return this.value;
    }
}