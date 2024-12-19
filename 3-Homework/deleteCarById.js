console.clear();

const fs = require('fs');
const path = require('path');

const carsFilePath = path.join(__dirname, 'cars.json');

function deleteCarById(id) {
    if (!fs.existsSync(carsFilePath)) {
        console.log('cars.json file does not exist.');
        return;
    }

    try {
        const existingData = JSON.parse(fs.readFileSync(carsFilePath, 'utf-8'));
        const carToDelete = existingData.find(car => car.id === id);

        if (!carToDelete) {
            console.log(`Car with id ${id} not found.`);
            return;
        }

        const updatedData = existingData.filter(car => car.id !== id);
        fs.writeFileSync(carsFilePath, JSON.stringify(updatedData, null, 2));
        console.log(`Car with id ${id} deleted.`);
    } catch (error) {
        console.error('Error processing cars.json:', error.message);
    }
}
deleteCarById(1);

