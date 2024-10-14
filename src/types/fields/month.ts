import { Locale } from "../../locales/locale";

export class Month {
    static JANUARY: Month = Month.of(1);
    static FEBRUARY: Month = Month.of(2);
    static MARCH: Month = Month.of(3);
    static APRIL: Month = Month.of(4);
    static MAY: Month = Month.of(5);
    static JUNE: Month = Month.of(6);
    static JULY: Month = Month.of(7);
    static AUGUST: Month = Month.of(8);
    static SEPTEMBER: Month = Month.of(9);
    static OCTOBER: Month = Month.of(10);
    static NOVEMBER: Month = Month.of(11);
    static DECEMBER: Month = Month.of(12);

    private readonly _value: number;
    private constructor(value: number) {
        this._value = value;
    }

    static of(value: number): Month {
        if (value < 1 || value > 12) {
            throw new Error("Invalid month");
        }
        return new Month(value);
    }

    get value(): number {
        return this._value;
    }
    name(locale: Locale): string {
        return locale.monthNames[this._value];
    }
}

export class MonthLocaled {
    constructor(private month: Month, private locale: Locale) {}

    get value(): number {
        return this.month.value;
    }
    get name(): string {
        return this.month.name(this.locale);
    }

    valueOf(): number {
        return this.value;
    }
}