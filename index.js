const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Aceita POST em qualquer URL (ex: /webhook, /callback, /)
app.post(/(.*)/, (req, res) => {
  console.log(`\n=== POST RECEBIDO em ${req.path} ===`);
  console.log('Body:', req.body);
  
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de teste (POST only) na porta ${PORT}`);
});