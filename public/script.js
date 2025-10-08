// Rota de upload
app.post('/upload', upload.single('arquivo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const { originalname, filename } = req.file;
    const sql = 'INSERT INTO imagens (nome_original, nome_arquivo) VALUES (?, ?)';

    db.query(sql, [originalname, filename], (err) => {
        if (err) {
            console.error('Erro ao salvar no banco:', err);
            return res.status(500).json({ error: 'Erro ao salvar no banco' });
        }
        res.json({ mensagem: 'Upload realizado com sucesso!' });
    });
});

// Rota de listagem
app.get('http://localhost:3000/index', (req, res) => {
    const sql = 'SELECT * FROM imagens ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar imagens:', err);
            return res.status(500).json({ error: 'Erro ao buscar imagens' });
        }
        res.json(results);
    });
});