console.clear();

const express = require('express');
const app = express();

app.use(express.json());

let phones = [
  { id: 1, name: 'Galaxy S23', brand: 'Samsung', price: 900, stock: 5 },
  { id: 2, name: 'iPhone 14', brand: 'Apple', price: 1100, stock: 3 }
];

app.delete('/phones/:id', (req, res) => {
  const { id } = req.params;

  const phoneIndex = phones.findIndex(p => p.id === parseInt(id));

  if (phoneIndex === -1) {
    return res.status(404).json({ message: 'Telefon topilmadi.' });
  }

  const deletedPhone = phones.splice(phoneIndex, 1)[0];

  res.status(200).json({ message: 'Telefon o\'chirildi.', deletedPhone });
});

app.listen(3000, () => {
  console.log('Server 3000-portda ishlamoqda...');
});
