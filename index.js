const express = require('express');
const app = express();

// Configuração atualizada para aceitar payloads grandes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const fs = require('fs');
const path = require('path');

app.post(/(.*)/, (req, res) => {
    // Pega o base64 (ajuste conforme a estrutura do seu JSON, ex: req.body.imagem)
    const base64Data = JSON.stringify(req.body); 

    const filePath = path.join(__dirname, 'dump_completo.txt');
    
    // Escreve o arquivo no disco do container
    fs.writeFile(filePath, base64Data, (err) => {
        if (err) {
            console.error('Erro ao salvar:', err);
            return res.status(500).send('Erro ao salvar');
        }
        console.log(`Arquivo salvo em: ${filePath} (${base64Data.length} bytes)`);
        
        // Se quiser baixar esse arquivo depois via browser:
        // res.download(filePath); 
        res.send({ status: 'salvo', path: filePath });
    });
});

// Rota para ver se o arquivo existe e qual o tamanho
app.get('/status-arquivo', (req, res) => {
    const filePath = '/tmp/recebido.json';
    
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        res.json({ 
            existe: true, 
            caminho: filePath, 
            tamanho_bytes: stats.size,
            tamanho_mb: (stats.size / 1024 / 1024).toFixed(2) + ' MB'
        });
    } else {
        res.status(404).json({ existe: false, msg: 'Nenhum arquivo encontrado.' });
    }
});

// Rota para baixar o arquivo propriamente dito
app.get('/baixar', (req, res) => {
    const filePath = '/tmp/recebido.json';
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('Arquivo não encontrado.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});