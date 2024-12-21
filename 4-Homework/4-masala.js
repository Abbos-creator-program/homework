console.clear();

const express = require('express');
const app = express();

app.use(express.json());

let phones = [
  { id: 1, name: 'Galaxy S23', brand: 'Samsung', price: 900, stock: 5 },
  { id: 2, name: 'iPhone 14', brand: 'Apple', price: 1100, stock: 3 }
];

app.put('/phones/:id', (req, res) => {
  const { id } = req.params;
  const { name, brand, price, stock } = req.body;

  const phone = phones.find(p => p.id === parseInt(id));

  if (!phone) {
    return res.status(404).json({ message: 'Telefon topilmadi.' });
  }

  if (!name && !brand && !price && !stock) {
    return res.status(400).json({ message: 'Bad Request: Kamida bitta maydon o\'zgartirilishi kerak.' });
  }

  if (name) phone.name = name;
  if (brand) phone.brand = brand;
  if (price) phone.price = price;
  if (stock) phone.stock = stock;

  res.status(200).json(phone);
});

app.listen(3000, () => {
  console.log('Server 3000-portda ishlamoqda...');
});
