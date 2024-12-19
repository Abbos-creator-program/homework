console.clear();

const fs = require('fs');
const path = require('path');

const carsFilePath = path.join(__dirname, 'cars.json');

function writeStreamExample(data) {
    if (!fs.existsSync(carsFilePath)) {
        fs.writeFileSync(carsFilePath, '[]'); 
        console.log('cars.json file created.');
    }

    const writeStream = fs.createWriteStream(carsFilePath, { flags: 'r+' });

    let existingData = JSON.parse(fs.readFileSync(carsFilePath, 'utf-8'));

    existingData.push(data);

    writeStream.write(JSON.stringify(existingData, null, 2));
    writeStream.end();

    writeStream.on('finish', () => {
        console.log('Data written using stream.');
    });

    writeStream.on('error', (err) => {
        console.error('Error writing to file:', err.message);
    });
}
writeStreamExample({ id: 3, model: 'tesla', price: 3000 });
