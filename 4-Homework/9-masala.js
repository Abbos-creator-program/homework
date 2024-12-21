console.clear();

const http = require('http');
const url = require('url');
const querystring = require('querystring');

let phones = [
  { id: 1, name: 'Galaxy S23', brand: 'Samsung', price: 900, stock: 5 },
  { id: 2, name: 'iPhone 14', brand: 'Apple', price: 1100, stock: 3 },
  { id: 3, name: 'Pixel 8', brand: 'Google', price: 800, stock: 7 }
];

let cart = [];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const queryParams = querystring.parse(parsedUrl.query); 
  const method = req.method;

  if (method === 'GET' && parsedUrl.pathname === '/phones') {
    let filteredPhones = phones;

    if (queryParams.brand) {
      filteredPhones = phones.filter(phone => phone.brand === queryParams.brand);
    }

    if (queryParams.maxPrice) {
      filteredPhones = filteredPhones.filter(phone => phone.price <= parseInt(queryParams.maxPrice));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(filteredPhones));

  } 

  else if (method === 'POST' && parsedUrl.pathname === '/phones') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const newPhone = JSON.parse(body);
        if (!newPhone.name || !newPhone.brand || !newPhone.price || !newPhone.stock) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Barcha maydonlar to\'liq bo\'lishi kerak.' }));
        }
        newPhone.id = phones.length + 1;
        phones.push(newPhone);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newPhone));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Noto\'g\'ri JSON format', error: error.message }));
      }
    });

  } 

  else if (method === 'PUT' && parsedUrl.pathname.startsWith('/phones/')) {
    const phoneId = parseInt(parsedUrl.pathname.split('/')[2]);
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const updatedData = JSON.parse(body);
        const phone = phones.find(p => p.id === phoneId);
        if (!phone) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Telefon topilmadi' }));
        }
        if (updatedData.name) phone.name = updatedData.name;
        if (updatedData.brand) phone.brand = updatedData.brand;
        if (updatedData.price) phone.price = updatedData.price;
        if (updatedData.stock) phone.stock = updatedData.stock;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(phone));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Noto\'g\'ri JSON format', error: error.message }));
      }
    });

  } 

  else if (method === 'DELETE' && parsedUrl.pathname.startsWith('/phones/')) {
    const phoneId = parseInt(parsedUrl.pathname.split('/')[2]);
    const phoneIndex = phones.findIndex(p => p.id === phoneId);
    if (phoneIndex === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Telefon topilmadi' }));
    }
    const deletedPhone = phones.splice(phoneIndex, 1);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(deletedPhone[0]));
  }

  else if (method === 'POST' && parsedUrl.pathname === '/cart') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const cartItem = JSON.parse(body);
        const phone = phones.find(p => p.id === cartItem.phoneId);
        if (!phone) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Telefon topilmadi' }));
        }
        if (phone.stock < cartItem.quantity) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Stock yetarli emas' }));
        }
        cart.push(cartItem);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cart));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Noto\'g\'ri JSON format', error: error.message }));
      }
    });
  }

  else if (method === 'GET' && parsedUrl.pathname === '/cart') {
    const cartDetails = cart.map(item => {
      const phone = phones.find(p => p.id === item.phoneId);
      return {
        phoneId: item.phoneId,
        quantity: item.quantity,
        totalPrice: phone.price * item.quantity
      };
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(cartDetails));
  }

  else if (method === 'POST' && parsedUrl.pathname === '/checkout') {
    if (cart.length === 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Savatcha bo\'sh' }));
    }

    for (const item of cart) {
      const phone = phones.find(p => p.id === item.phoneId);
      if (phone.stock < item.quantity) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Stock yetarli emas' }));
      }
      phone.stock -= item.quantity;
    }

    cart = [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Buyurtma qabul qilindi' }));
  }

  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

server.listen(3000, () => {
  console.log('Server 3000-portda ishlamoqda...');
});
