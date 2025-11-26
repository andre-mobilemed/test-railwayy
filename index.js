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