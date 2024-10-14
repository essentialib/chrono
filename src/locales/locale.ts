const IS_DIST = false;

export const getLocale = () => Locale.of(IS_DIST ?
    String(App.getContext().getResources().getConfiguration().locale.toString()) :
    Intl.DateTimeFormat().resolvedOptions().locale
);

export const getLocaleFrom = (locale: LocaleLike) => {
    if (typeof locale === "string") {
        locale = Locale.of(locale);
    }
    return locale;
}

export abstract class Locale {
    protected _code: string;
    protected static _map: { [key: string]: Locale } = {};
    protected constructor(code: string) {
        this._code = code;
    }

    get code(): string {
        return this._code;
    }

    static of(code: string): Locale {
        code = code.replaceAll('-', '_').toLowerCase();

        if (!(code in Locale._map)) {
            throw new Error(`Unsupported locale: ${code}`);
        }
        return Locale._map[code];
    }

    abstract dateFormat(year: string, month: string, day: string, dayOfWeek: string): string;
    abstract timeFormat(hour: string, minute: string, second: string, millisecond: string): string;
    abstract dateTimeFormat(year: string, month: string, day: string, dayOfWeek: string, hour: string, minute: string, second: string, millisecond: string): string;

    abstract ampm: [string, string];
    abstract monthNames: string[];
    abstract shortMonthNames: string[];
    abstract dayOfWeekNames: string[];
    abstract shortDayOfWeekNames: string[];
}

export type LocaleLike = string | Locale;