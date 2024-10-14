import { Locale } from "../../locales";

export class DayOfWeek {
    static SUNDAY: DayOfWeek = DayOfWeek.of(0);
    static MONDAY: DayOfWeek = DayOfWeek.of(1);
    static TUESDAY: DayOfWeek = DayOfWeek.of(2);
    static WEDNESDAY: DayOfWeek = DayOfWeek.of(3);
    static THURSDAY: DayOfWeek = DayOfWeek.of(4);
    static FRIDAY: DayOfWeek = DayOfWeek.of(5);
    static SATURDAY: DayOfWeek = DayOfWeek.of(6);

    private readonly _value: number;
    private constructor(value: number) {
        this._value = value;
    }

    static of(value: number): DayOfWeek {
        if (value < 0 || value > 6) {
            throw new Error("Invalid month");
        }
        return new DayOfWeek(value);
    }

    get value(): number {
        return this._value;
    }
    name(locale: Locale): string {
        return locale.dayOfWeekNames[this._value];
    }
}

export class DayOfWeekLocaled {
    constructor(private dayOfWeek: DayOfWeek, private locale: Locale) {}

    get value(): number {
        return this.dayOfWeek.value;
    }
    get name(): string {
        return this.dayOfWeek.name(this.locale);
    }

    valueOf(): number {
        return this.value;
    }
}