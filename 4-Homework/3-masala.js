console.clear();


const express = require('express');
const app = express();

app.use(express.json());

let phones = [];

app.post('/phones', (req, res) => {
  const { name, brand, price, stock } = req.body;

  if (!name || !brand || !price || !stock) {
    return res.status(400).json({ message: 'Bad Request: Barcha maydonlar to\'liq bo\'lishi kerak.' });
  }

  const newPhone = { name, brand, price, stock };
  phones.push(newPhone);

  res.status(201).json(newPhone);
});

app.listen(3000, () => {
  console.log('Server 3000-portda ishlamoqda...');
});
