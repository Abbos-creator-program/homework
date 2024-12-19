console.clear();

const fs = require('fs');
const path = require('path');

const carsFilePath = path.join(__dirname, 'cars.json');

function readStreamExample() {
    if (!fs.existsSync(carsFilePath)) {
        console.log('cars.json file does not exist.');
        return;
    }

    const readStream = fs.createReadStream(carsFilePath, 'utf-8');
    readStream.on('data', chunk => {
        console.log('Reading chunk:', chunk);
    });

    readStream.on('end', () => {
        console.log('Finished reading file.');
    });

    readStream.on('error', error => {
        console.error('Error reading file:', error.message);
    });
}

readStreamExample();
