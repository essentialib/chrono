import { Date } from "../datetime";
import { MonthNumbers } from "../datetime/fields";

export class Calendar {
    [Symbol.toStringTag] = "Calendar";

    monthToString(year: number, month: MonthNumbers): string {
        const dt = Date.of(year, month);
        const now = Date.now();

        const firstDay = dt.withDay(1);
        const arr = [Array(7).fill("00 \u200d")];
        let n = 0;

        for (let d = firstDay; d.month === dt.month; d = d.plusDays(1)) {
            if (d.day !== 1 && d.weekday.value === 0)   // 첫 주가 비어있는 경우
                arr[++n] = [];

            const idx = (n === 0 ? firstDay.day : 0) + d.weekday.value;
            arr[n][idx] = now.equals(d)
                ? d.toString('DD').split('').map(e => String.fromCharCode(55349, 57324 + Number(e))).join('') + ' '
                : d.toString('DD') + ' \u200d';
        }

        if (arr[0].length !== 7)
            arr[0] = arr[0].slice(1, 8); // 첫 주가 비어있는 경우

        return dt.toString('YYYY년 MM월\n\n') + arr.join('\n').split(',').join('') + '\n';
    }
}