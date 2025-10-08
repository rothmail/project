const mysql = require('mysql2');

// Configuração da conexão com o banco
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'upload_db'
});

// Teste de conexão
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
    } else {
        console.log('Conectado ao MySQL com sucesso!');
    }
});

module.exports = db;