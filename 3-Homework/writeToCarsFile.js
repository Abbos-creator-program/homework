console.clear();

const fs = require('fs');
const path = require('path');

const carsFilePath = path.join(__dirname, 'cars.json');

function writeToCarsFile(data) {
    if (!fs.existsSync(carsFilePath)) {
        fs.writeFileSync(carsFilePath, JSON.stringify([data], null, 2));
    } else {
        const existingData = JSON.parse(fs.readFileSync(carsFilePath));
        existingData.push(data);
        fs.writeFileSync(carsFilePath, JSON.stringify(existingData, null, 2));
    }
    console.log('Data written to cars.json');
}
writeToCarsFile({ id: 1, model: 'audi', price: 1000 });
writeToCarsFile({ id: 2, model: 'bmw', price: 2000 });
