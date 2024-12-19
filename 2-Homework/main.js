console.clear();

const { sleep } = require('./sleep');
const { getRandomNumber } = require('./random');
const { Person } = require('./person');

const randomMilliseconds = getRandomNumber();
console.log(`Sleeping for ${randomMilliseconds} milliseconds...`);

sleep(randomMilliseconds).then(() => {
    const person = new Person('John Doe', 1990);
    console.log(person.getInfo());
});
