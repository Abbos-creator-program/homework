console.clear();

const fs = require('fs');
const path = require('path');

function createFolders(...folderNames) {
    if (folderNames.length < 1 || folderNames.length > 100) {
        throw new Error('Folder names count must be between 1 and 100.');
    }

    folderNames.forEach(folderName => {
        const folderPath = path.join(__dirname, folderName);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
            console.log(`Folder "${folderName}" created.`);
        } else {
            console.log(`Folder "${folderName}" already exists.`);
        }
    });
}
createFolders('cars', 'bikes', 'trucks');
