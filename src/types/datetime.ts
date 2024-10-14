import { Locale, LocaleLike, getLocale } from "../locales/locale";
import { DayOfWeekLocaled } from "./fields/dayofweek";
import { Month, MonthLocaled } from "./fields/month";

const IS_DIST = false;
const $D = globalThis.Date;

enum TimeField { HOUR, MINUTE, SECOND, MILLISECOND }

export class Time implements ITime {
    constructor(
        private D: globalThis.Date,
        private locale: Locale = getLocale()
    ) {

    }
}

export class DateTime implements IDate, ITime {
    constructor(
        private D: globalThis.Date,
        private locale: Locale = getLocale()
    ) {

    }
}
