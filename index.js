const express = require('express');
const app = express();

// Configuração atualizada para aceitar payloads grandes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post(/(.*)/, (req, res) => {
  console.log(`\n=== POST RECEBIDO (${req.get('content-length')} bytes) ===`);
  // Cuidado ao logar o body inteiro se for um arquivo gigante, vai sujar seu log
  // console.log('Body:', req.body); 
  
  res.status(200).json({ status: 'ok', size: req.get('content-length') });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});