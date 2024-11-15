export class Period {
    constructor(
        public year: number = 0,
        public month: number = 0,
        public day: number = 0,
        public hour: number = 0,
        public minute: number = 0,
        public second: number = 0,
        public millisecond: number = 0
    ) {}

    toString(): string {
        return `P${this.year}Y${this.month}M${this.day}DT${this.hour}H${this.minute}M${this.second}.${this.millisecond}S`;
    }
}