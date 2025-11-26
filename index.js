const express = require('express');
const app = express();

// Configuração atualizada para aceitar payloads grandes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post(/(.*)/, (req, res) => {
  // Supondo que o base64 venha num campo chamado 'data' ou seja o body todo
  const conteudo = req.body; 

  console.log('Recebido com sucesso. Tamanho:', JSON.stringify(conteudo).length);
  
  // Devolve tudo para quem chamou. 
  // O cliente (seu computador) vai conseguir ler tudo, o log do servidor não.
  res.status(200).json(conteudo); 
});