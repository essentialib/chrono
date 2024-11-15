import { describe, expect, test } from "vitest";
import { Period } from "../range/period";
import { Time } from "./time";

describe('TimeInterval', () => {
    test('should return the correct time interval', () => {
        const start = Time.now();
        const end = start.plusHours(3).plusMinutes(5);
        const interval = start.until(end);

        console.log(interval, interval.toPeriod());

        expect(interval.toPeriod()).instanceof(Period);
    });
});