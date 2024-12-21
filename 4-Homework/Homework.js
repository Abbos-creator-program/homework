console.clear();

const http = require('http');
const url = require('url');

let phones = [
    { id: 1, name: "iPhone 14", brand: "Apple", price: 1200, stock: 10 },
    { id: 2, name: "Galaxy S23", brand: "Samsung", price: 900, stock: 15 },
    { id: 3, name: "Pixel 7", brand: "Google", price: 800, stock: 5 }
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    res.setHeader('Content-Type', 'application/json');

    const sendResponse = (statusCode, data) => {
        res.statusCode = statusCode;
        res.end(JSON.stringify(data));
    };

    if (method === 'GET' && path === '/phones') {
        let filteredPhones = phones;

        if (query.brand) {
            filteredPhones = filteredPhones.filter(phone => phone.brand === query.brand);
        }
        if (query.maxPrice) {
            filteredPhones = filteredPhones.filter(phone => phone.price <= Number(query.maxPrice));
        }

        sendResponse(200, filteredPhones);
    }

    else if (method === 'GET' && path.startsWith('/phones/')) {
        const id = parseInt(path.split('/')[2], 10);
        const phone = phones.find(p => p.id === id);

        if (phone) {
            sendResponse(200, phone);
        } else {
            sendResponse(404, { error: 'Phone not found' });
        }
    }

    else if (method === 'POST' && path === '/phones') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const newPhone = JSON.parse(body);

                if (!newPhone.name || !newPhone.brand || typeof newPhone.price !== 'number' || typeof newPhone.stock !== 'number') {
                    sendResponse(400, { error: 'Invalid phone data' });
                    return;
                }

                newPhone.id = phones.length ? phones[phones.length - 1].id + 1 : 1;
                phones.push(newPhone);
                sendResponse(201, newPhone);
            } catch (error) {
                sendResponse(400, { error: 'Invalid JSON format' });
            }
        });
    }

    else if (method === 'PUT' && path.startsWith('/phones/')) {
        const id = parseInt(path.split('/')[2], 10);
        const phoneIndex = phones.findIndex(p => p.id === id);

        if (phoneIndex === -1) {
            sendResponse(404, { error: 'Phone not found' });
            return;
        }

        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const updates = JSON.parse(body);

                if (!Object.keys(updates).length) {
                    sendResponse(400, { error: 'No updates provided' });
                    return;
                }

                phones[phoneIndex] = { ...phones[phoneIndex], ...updates };
                sendResponse(200, phones[phoneIndex]);
            } catch (error) {
                sendResponse(400, { error: 'Invalid JSON format' });
            }
        });
    }

    else if (method === 'DELETE' && path.startsWith('/phones/')) {
        const id = parseInt(path.split('/')[2], 10);
        const phoneIndex = phones.findIndex(p => p.id === id);

        if (phoneIndex === -1) {
            sendResponse(404, { error: 'Phone not found' });
            return;
        }

        const deletedPhone = phones.splice(phoneIndex, 1);
        sendResponse(200, deletedPhone[0]);
    }
    else {
        sendResponse(404, { error: 'Route not found' });
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
