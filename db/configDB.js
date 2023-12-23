const { Pool } = require('pg');

// Configuração do pool de conexões
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'projeto',
    password: 'postgres',
    port: 5432, // porta padrão do PostgreSQL
});

// Testando a conexão
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro na conexão com o PostgreSQL', err);
    } else {
        console.log('Conexão bem-sucedida! Hora atual do PostgreSQL:', res.rows[0].now);
    }
    // Encerra a pool de conexões (opcional, dependendo do seu caso de uso)
    //  pool.end();
});

module.exports = {
    Pool: Pool,
    pool: pool
}