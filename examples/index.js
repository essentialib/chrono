// example code

const { DateTime } = require('../src/types');
const chrono = require('../src');

chrono.timer(() => console.log("hello world"), 1000);