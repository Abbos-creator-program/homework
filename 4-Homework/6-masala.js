console.clear();


const express = require('express');
const app = express();

app.use(express.json());

let phones = [
  { id: 1, name: 'Galaxy S23', brand: 'Samsung', price: 900, stock: 5 },
  { id: 2, name: 'iPhone 14', brand: 'Apple', price: 1100, stock: 3 },
  { id: 3, name: 'Pixel 8', brand: 'Google', price: 800, stock: 7 }
];

let cart = [];

app.post('/cart', (req, res) => {
  const { phoneId, quantity } = req.body;

  const phone = phones.find(p => p.id === phoneId);

  if (!phone) {
    return res.status(400).json({ message: 'Telefon topilmadi.' });
  }
  if (phone.stock < quantity) {
    return res.status(400).json({ message: 'Stock yetarli emas.' });
  }

  const cartItem = cart.find(item => item.phoneId === phoneId);
  if (cartItem) {
    cartItem.quantity += quantity; 
  } else {
    cart.push({ phoneId, quantity });
  }

  phone.stock -= quantity;

  res.status(200).json(cart);
});

app.get('/cart', (req, res) => {
  const cartDetails = cart.map(item => {
    const phone = phones.find(p => p.id === item.phoneId);
    return {
      phoneId: item.phoneId,
      quantity: item.quantity,
      totalPrice: phone.price * item.quantity
    };
  });

  res.status(200).json(cartDetails);
});

app.delete('/cart', (req, res) => {
  const { phoneId } = req.query;

  const cartIndex = cart.findIndex(item => item.phoneId === parseInt(phoneId));

  if (cartIndex === -1) {
    return res.status(404).json({ message: 'Telefon savatchada topilmadi.' });
  }

  const cartItem = cart.splice(cartIndex, 1)[0];

  const phone = phones.find(p => p.id === cartItem.phoneId);
  phone.stock += cartItem.quantity;

  res.status(200).json(cart.length ? cart : []);
});

app.listen(3000, () => {
  console.log('Server 3000-portda ishlamoqda...');
});
