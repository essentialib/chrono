import { Locale } from "../locales";
import { Interval } from "../range/interval";

export interface IBase {
    get locale(): Locale;

    copy(): IBase;
    isAfter(other: IBase): boolean;
    isAfterOrEquals(other: IBase): boolean;
    isBefore(other: IBase): boolean;
    isBeforeOrEquals(other: IBase): boolean;
    equals(other: IBase): boolean;
    compareTo(other: IBase): -1 | 0 | 1;
    toString(format?: string): string;
}