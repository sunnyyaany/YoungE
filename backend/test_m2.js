const { calculateFourPillars } = require('manseryeok');
const date = new Date('1995-05-15T12:00:00Z');
console.log(JSON.stringify(calculateFourPillars(date, 'M', false), null, 2));
