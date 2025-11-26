const express = require('express');
const app = express();

// Middleware para processar JSON e URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota coringa que pega TUDO
app.all('*', (req, res) => {
  console.log(`\n=== NOVA REQUISIÇÃO [${req.method}] ===`);
  console.log('Headers:', req.headers);
  console.log('Query Params:', req.query);
  console.log('Body:', req.body);
  
  // Responde rápido para quem chamou não dar timeout
  res.status(200).json({ status: 'recebido', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});