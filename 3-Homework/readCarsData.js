console.clear();

const fs = require('fs');
const path = require('path');

const carsFilePath = path.join(__dirname, 'cars.json');

function readCarsData() {
    if (!fs.existsSync(carsFilePath)) {
        console.log('cars.json file does not exist.');
        return [];
    }

    try {
        const data = JSON.parse(fs.readFileSync(carsFilePath, 'utf-8'));
        console.log('Cars data:', data);
        return data;
    } catch (error) {
        console.error('Error reading or parsing cars.json:', error.message);
        return [];
    }
}
readCarsData();

