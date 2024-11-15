export abstract class Locale {
    protected _code: string;

    protected constructor(code: string) {
        this._code = code;
    }

    get code(): string {
        return this._code;
    }

    toString(): string {
        return `Locale(${this._code})`;
    }

    valueOf(): string {
        return this._code;
    }

    // TODO: parser 폴더에서 구현한 parser, refiner 를 사용해서 각 locale 마다 parser 구현

    // TODO: Intl locale 은 전부 추가하기

    abstract dateFormat(year: string, month: string, day: string, weekday: string): string;
    abstract timeFormat(hour: string, minute: string, second: string, millisecond: string): string;
    abstract dateTimeFormat(year: string, month: string, day: string, weekday: string, hour: string, minute: string, second: string, millisecond: string): string;

    abstract ampm: [string, string];
    abstract monthNames: string[];
    abstract shortMonthNames: string[];
    abstract weekdayNames: string[];
    abstract shortWeekdayNames: string[];
}

export type LocaleLike = string | Locale;