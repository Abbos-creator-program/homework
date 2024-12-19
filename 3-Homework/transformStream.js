console.clear();

const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

const carsFilePath = path.join(__dirname, 'cars.json');

function transformExample() {
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            const transformed = chunk.toString().toUpperCase();
            callback(null, transformed); 
        }
    });

    const readStream = fs.createReadStream(carsFilePath, 'utf-8');
    const writeStream = fs.createWriteStream('transformed_cars.json');

    readStream.pipe(transformStream).pipe(writeStream);

    writeStream.on('finish', () => {
        console.log('Data transformed and written to transformed_cars.json');
    });

    writeStream.on('error', (err) => {
        console.error('Error writing to file:', err.message);
    });
}
transformExample();
