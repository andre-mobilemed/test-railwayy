const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const ARQUIVO_PATH = path.join('/tmp', 'arquivo_recebido.txt');

// --- ROTA 1: POST (Recebe o arquivo gigante via Stream) ---
// Aceita qualquer rota POST (ex: /, /webhook, /upload)
app.post(/(.*)/, (req, res) => {
    console.log(`\n>>> Iniciando recebimento de upload...`);
    
    // Cria o fluxo de escrita direto para o disco
    const writeStream = fs.createWriteStream(ARQUIVO_PATH);
    
    // Conecta a torneira da internet direto no arquivo
    req.pipe(writeStream);

    // Quando o fluxo terminar (arquivo salvo)
    writeStream.on('finish', () => {
        const stats = fs.statSync(ARQUIVO_PATH);
        console.log(`>>> Arquivo salvo com sucesso! Tamanho: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        
        res.status(200).json({
            status: 'sucesso',
            mensagem: 'Arquivo recebido e salvo no disco temporário.',
            caminho: ARQUIVO_PATH,
            tamanho_bytes: stats.size
        });
    });

    // Se der erro no meio do caminho
    writeStream.on('error', (err) => {
        console.error('Erro na escrita do arquivo:', err);
        res.status(500).send('Erro ao salvar arquivo.');
    });
});

// --- ROTA 2: GET /status (Verifica se o arquivo está lá) ---
app.get('/status', (req, res) => {
    if (fs.existsSync(ARQUIVO_PATH)) {
        const stats = fs.statSync(ARQUIVO_PATH);
        res.json({
            existe: true,
            tamanho: (stats.size / 1024 / 1024).toFixed(2) + ' MB',
            caminho: ARQUIVO_PATH,
            data_modificacao: stats.mtime
        });
    } else {
        res.status(404).json({ existe: false, msg: 'Nenhum arquivo enviado ainda.' });
    }
});

// --- ROTA 3: GET /baixar (Faz o download do arquivo para seu PC) ---
app.get('/baixar', (req, res) => {
    if (fs.existsSync(ARQUIVO_PATH)) {
        res.download(ARQUIVO_PATH, 'download-teste.txt');
    } else {
        res.status(404).send('Arquivo não encontrado. Faça o POST primeiro.');
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Node v22 rodando na porta ${PORT}`);
    console.log(`Pasta temporária: /tmp`);
});