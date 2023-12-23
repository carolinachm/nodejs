// importar modulo express
const express = require('express')
//importa modulo express-handlebars
const { engine } = require('express-handlebars');
//importar modulo de upload
const fileupload = require('express-fileupload')

// importar modulo postgresql
const { Pool } = require('pg');
//configuração do banco postgresql
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'projeto',
    port: 5432
})
// pool.query('SELECT * FROM produtos', (err, result) => {
//     if (err) { console.error('Error executing query:', err); }
//     else { console.log('Query result:', result.rows); }
// });


//App
const app = express()

//Manipulação de dados via rotas
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

//habilitando o upload de arquivos
app.use(fileupload())

//configuração do handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');




const PORT = 3000;


//adicionar bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))

//adicionar css
app.use('/css', express.static('./css'))

//rota principal
app.get('/', (req, res) => {
    res.render('formulario')
})
//rota de cadastro
app.post('/cadastrar', (req, res) => {
    //Obter os dados que serão utilizados para o cadastro
    let nome = req.body.nome;
    let descricao = req.body.descricao;
    let valor = req.body.valor;
    let imagem = req.files.imagem.name;

    //SQL
    let sql = `INSERT INTO produtos(nome, descricao, valor, imagem) VALUES ('${nome}', '${descricao}', ${valor}, '${imagem}')`

    //executar o sql
    pool.query(sql, (erro, retorno) => {
        if (erro) { console.error('Error executing query:', erro); }
          else { console.log('Query result:', retorno.rows); }

        //caso ocorra o cadastro
        req.files.imagem.mv(__dirname + '/imagens/' + req.files.imagem.name)
        console.log(retorno)
    });



})

//Servidor
app.listen(PORT, () => {
    console.log(`Rodando na porta http://localhost:${PORT}`);
})