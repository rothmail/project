const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db_config'); // conexão com o banco

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // garante caminho absoluto
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // ex: 16968737283.jpg
    }
});

const upload = multer({ storage });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve index.html e script.js
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve imagens

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('http://localhost:3000/upload', upload.single('arquivo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const { originalname, filename } = req.file;

    const sql = 'INSERT INTO imagens (nome_original, nome_arquivo) VALUES (?, ?)';
    db.query(sql, [originalname, filename], (err) => {
        if (err) {
            console.error('Erro ao salvar no banco:', err);
            return res.status(500).json({ error: 'Erro ao salvar no banco de dados.' });
        }
        res.json({ mensagem: '✅ Upload realizado com sucesso!' });
    });
});
app.get('http://localhost:3000/imagens', (req, res) => {
    const sql = 'SELECT * FROM imagens ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar imagens:', err);
            return res.status(500).json({ error: 'Erro ao buscar imagens.' });
        }
        res.json(results);
    });
});
app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});