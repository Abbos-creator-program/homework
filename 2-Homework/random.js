console.clear();

function getRandomNumber() {
    return Math.floor(Math.random() * (999 - 100 + 1)) + 100;
}
module.exports = { getRandomNumber };
