const Runnable = java.lang.Runnable;
const Executors = java.util.concurrent.Executors;
const TimeUnit = java.util.concurrent.TimeUnit;

const executor = Executors.newSingleThreadScheduledExecutor();

executor.scheduleAtFixedRate(new Runnable({
    run() {
        
    }
}))

export class Clock {
    [Symbol.toStringTag] = 'Clock';
}

Clock.timer(1000, () => {
    console.log('Hello World');
});

Clock.cron('0 0 0 * * *', () => {
    console.log('Midnight');
});