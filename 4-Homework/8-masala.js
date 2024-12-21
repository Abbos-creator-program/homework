console.clear();

const express = require('express');
const app = express();
const url = require('url');
const querystring = require('querystring');

let phones = [
  { id: 1, name: 'Galaxy S23', brand: 'Samsung', price: 900, stock: 5 },
  { id: 2, name: 'iPhone 14', brand: 'Apple', price: 1100, stock: 3 },
  { id: 3, name: 'Pixel 8', brand: 'Google', price: 800, stock: 7 }
];

let cart = [];

app.post('/checkout', (req, res) => {
  const parsedUrl = url.parse(req.url);
  const queryParams = querystring.parse(parsedUrl.query);

  console.log('Query Parameters:', queryParams);

  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const requestBody = JSON.parse(body);

      if (cart.length === 0) {
        return res.status(400).json({ message: 'Savatcha bo\'sh. Iltimos, telefon qo\'shing.' });
      }

      for (const item of cart) {
        const phone = phones.find(p => p.id === item.phoneId);
        if (!phone) {
          return res.status(404).json({ message: `Telefon topilmadi (ID: ${item.phoneId}).` });
        }

        if (phone.stock < item.quantity) {
          return res.status(400).json({ message: `Stock yetarli emas: ${phone.name}` });
        }

        phone.stock -= item.quantity;
      }

      cart = [];

      res.status(200).json({ message: 'Buyurtma qabul qilindi', cart });

    } catch (error) {
      res.status(400).json({ message: 'Invalid JSON format', error: error.message });
    }
  });
});

app.listen(3000, () => {
  console.log('Server 3000-portda ishlamoqda...');
});
