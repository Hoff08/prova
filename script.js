const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());

const LOG_FILE = 'logs.txt';

function registrarLog(nomeAluno) {
    const id = uuidv4();
    const dataHora = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const mensagem = `${id} - ${dataHora} - ${nomeAluno}\n`;
    
    fs.appendFileSync(LOG_FILE, mensagem);
    return id;
}

function buscarLogPorId(id) {
    try {
        const logs = fs.readFileSync(LOG_FILE, 'utf8');
        const linhas = logs.split('\n');
        
        for (const linha of linhas) {
            if (linha.startsWith(id)) {
                return linha;
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

app.post('/logs', (req, res) => {
    const { nome } = req.body;
    
    if (!nome) {
        return res.status(400).json({ erro: 'Nome do aluno é obrigatório' });
    }
    
    const id = registrarLog(nome);
    res.status(201).json({ 
        mensagem: 'Log registrado com sucesso',
        id: id
    });
});

app.get('/logs/:id', (req, res) => {
    const { id } = req.params;
    const log = buscarLogPorId(id);
    
    if (!log) {
        return res.status(404).json({ erro: 'Log não encontrado' });
    }
    
    res.json({ log });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 