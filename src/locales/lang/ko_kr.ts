import { Locale } from "../locale";

class KoKR extends Locale {
    static INSTANCE: KoKR = new KoKR();
    constructor() {
        super("ko_kr");
        Locale._map[this._code] = KoKR.INSTANCE;
    }

    dateFormat(year: string, month: string, day: string, dayOfWeek: string): string {
        return `${year}년 ${month}월 ${day}일`;
    }

    timeFormat(hour: string, minute: string, second: string, millisecond: string): string {
        return `${hour}시 ${minute}분 ${second}초`;
    }

    dateTimeFormat(year: string, month: string, day: string, dayOfWeek: string, hour: string, minute: string, second: string, millisecond: string): string {
        return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분 ${second}초`;
    }

    ampm: [string, string] = ["오전", "오후"];
    monthNames = ['', "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    shortMonthNames = this.monthNames;
    dayOfWeekNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    shortDayOfWeekNames = this.dayOfWeekNames;
}

export const ko_kr = KoKR.INSTANCE;