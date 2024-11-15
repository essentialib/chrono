import * as Languages from './lang';
import { Locale, LocaleLike } from "./locale";

const IS_DIST = false;

export const getLocale = () => Locales.of(IS_DIST ?
    String(App.getContext().getResources().getConfiguration().locale.toString()) :
    Intl.DateTimeFormat().resolvedOptions().locale
);

export const getLocaleFrom = (locale: LocaleLike) => {
    return typeof locale === "string" ? Locales.of(locale) : locale;
}

export class Locales {
    private static _map = Languages as { [key: string]: Locale };

    static of(code: string): Locale {
        if (!/^[a-z]{2}-[A-Z]{2}$/.test(code))
            throw new TypeError(`locale code must be in the format of xx-XX`);

        code = code.replace('-', '');

        if (!(code in Locales._map))
            throw new Error(`Unsupported locale: ${code}`);

        return Locales._map[code];
    }
}
