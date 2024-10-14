return format.replace(/ss?s?|mm?|hh?|ii?|t|DD?|WW?|MM?M?M?|YY(?:YY)?/g, match => {
    switch (match) {
        case 's':
            return this.se;
        case 'ss':
            return this.second.toString().padStart(2, '0');
        case 'sss':
            return this.millisecond;
        case 'm':
            return this.minute;
        case 'mm':
            return this.minute.toString().padStart(2, '0');
        case 'h':
            return this.hour === 12 ? 12 : this.hour % 12;
        case 'hh':
            return (this.hour === 12 ? 12 : this.hour % 12).toString().padStart(2, '0');
        case 'i':
            return this.hour;
        case 'ii':
            return this.hour.toString().padStart(2, '0');
        case 't':
            return cultureInfo['t'][this.hour < 12 ? 0 : 1];
        case 'D':
            return this.day;
        case 'DD':
            return this.day.toString().padStart(2, '0');
        case 'W':
            return cultureInfo['W'][this.weekday];
        case 'WW':
            return cultureInfo['WW'][this.weekday];
        case 'M':
            return this.month;
        case 'MM':
            return this.month.toString().padStart(2, '0');
        case 'MMM':
            return cultureInfo['MMM'][this.month - 1];
        case 'MMMM':
            return cultureInfo['MMMM'][this.month - 1];
        case 'YY':
            return this.year % 100;
        case 'YYYY':
            return this.year;
        default:
            throw new Error(`unknown format ${match}`);
    }
});