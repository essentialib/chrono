import { describe, expect, test } from "vitest";
import { CronPattern } from "./pattern";

describe("parseEach", () => {
    test("1,2,3/5,*/2,2-4,3-5/2", () => {
        expect(CronPattern.parseField('1,2,3/5,*/2,2-4,3-5/2')).toEqual([
            { value: 1, step: undefined },
            { value: 2, step: undefined },
            { value: 3, step: 5 },
            { value: '*', step: 2 },
            { from: 2, to: 4, step: 1 },
            { from: 3, to: 5, step: 2 }
        ]);
    });

    test("1,2,3,4,5", () => {
        expect(CronPattern.parseField('1,2,3,4,5')).toEqual([
            { value: 1, step: undefined },
            { value: 2, step: undefined },
            { value: 3, step: undefined },
            { value: 4, step: undefined },
            { value: 5, step: undefined }
        ]);
    });
});

describe("isMatchEach", () => {
    test("3 is not */2", () => {
        expect(CronPattern.isMatchField(CronPattern.parseField('*/2'), 3)).toBe(false);
    });

    test("4 is */2", () => {
        expect(CronPattern.isMatchField(CronPattern.parseField('*/2'), 4)).toBe(true);
    });

    test("3 is 2-4", () => {
        expect(CronPattern.isMatchField(CronPattern.parseField('2-4'), 3)).toBe(true);
    });

    // 0-20/2
    // 0-15
    // 14,18,20
    // *
    // */5
    // 4/5
    // 1,2,3/5
    // 1,2,3-5
    // 23 1,2-4/2,4 * * *
    // 23 */2,*/3 * * *
    // '0-20/2' -> { from: 0, to: 20, step: 2 }
    // '0-20' -> { from: 0, to: 20 }
    // '14,18' -> { values: [14, 18] }
    // '*' -> {}
    // '*/3' -> { step: 3 }
    // '5' -> { value: 5 }
    test("1,2,3,8,13 is 1,2,3/5", () => {
        console.log(CronPattern.parseField('1,2,3/5'));
        expect(CronPattern.isMatchField(CronPattern.parseField('1,2,3/5'), 1)).toBe(true);
        expect(CronPattern.isMatchField(CronPattern.parseField('1,2,3/5'), 2)).toBe(true);
        expect(CronPattern.isMatchField(CronPattern.parseField('1,2,3/5'), 3)).toBe(true);
        expect(CronPattern.isMatchField(CronPattern.parseField('1,2,3/5'), 8)).toBe(true);
        expect(CronPattern.isMatchField(CronPattern.parseField('1,2,3/5'), 13)).toBe(true);
    });

    test("0-20/2", () => {
        const parsed = CronPattern.parseField('0-20/2');
        for (let i = 0; i <= 20; i++) {
            expect(CronPattern.isMatchField(parsed, i)).toBe(i % 2 === 0);
        }
    });
});