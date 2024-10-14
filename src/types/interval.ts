import { Period } from "./period";

export interface Interval {
    toPeriod(): Period;
}