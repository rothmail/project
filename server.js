const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db_config'); // Importando a conexão do banco
const cors = require('cors');

const app = express();
const port = 3000;

// Configuração do Multer para salvar localmente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage });

// Middlewares
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(cors());

// Rota de upload
app.post('/upload', upload.single('arquivo'), (req, res) => {
    const { originalname, filename } = req.file;

    const sql = 'INSERT INTO imagens (nome_original, nome_arquivo) VALUES (?, ?)';

    db.query(sql, [originalname, filename], (err, results) => {
        if (err) {
            console.error('Erro ao salvar no banco:', err);
            return res.status(500).json({ error: 'Erro ao salvar no banco' });
        }
        res.json({ mensagem: 'Upload realizado com sucesso!' });
    });
});

// Rota para listar as imagens
app.get('/imagens', (req, res) => {
    const sql = 'SELECT * FROM imagens ORDER BY id DESC';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar imagens:', err);
            return res.status(500).json({ error: 'Erro ao buscar imagens' });
        }
        res.json(results);
    });
});

// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});