// example code

const { DateTime } = require('../src/types');
const chrono = require('../src');

calendar.monthToString(2024, 5);

clock.timer(1000, () => {
    console.log('every second');
});

chrono.cron('* 1,2 */2 * *', () => {
    console.log('every minute at 1 and 2 hours of every 2nd day');
});

chrono.timer(2000, () => {
    console.log('every 2 seconds');
});

const bot = BotManger