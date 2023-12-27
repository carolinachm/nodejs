// importar modulo express
const express = require('express')
//importa modulo express-handlebars
const { engine } = require('express-handlebars');
//importar modulo de upload
const fileupload = require('express-fileupload')

//file-system(manipular arquivos)
const fs = require('fs');

const pool = require('./db/configDB').pool

//App
const app = express()

//Manipulação de dados via rotas
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//habilitando o upload de arquivos
app.use(fileupload())

//configuração do handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


//adicionar bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))

//adicionar css
app.use('/public', express.static('./public/css'))
//referenciar a pasta de imagem
app.use('/imagens', express.static('./imagens'))


//Rota principal
// app.get('/', (req, res) => {
//     // envia o arquivo da página principal
//     res.sendFile(__dirname + '/views/formulario')
// })
// app.get('/', (req, res) => {
//     res.render('formulario')
// })
//rota para retornar todos os produtos
app.get('/', (req, res) => {
    //SQL
    let sql = (`SELECT * FROM produtos`)
    //executar o sql
    pool.query(sql, function (erro, retorno) {
        res.render('formulario', { produtos: retorno.rows })
    });
})
//rota de cadastro
app.post('/cadastrar', (req, res) => {
    //Obter os dados que serão utilizados para o cadastro
    let nome = req.body.nome;
    let descricao = req.body.descricao;
    let valor = req.body.valor;
    let imagem = req.files.imagem.name;

    //SQL
    let sql = `INSERT INTO produtos(nome, descricao, valor, imagem) VALUES ('${nome}', '${descricao}', ${valor}, '${imagem}')`;

    //executar o sql
    pool.query(sql, function (erro, retorno) {
        if (erro) throw erro;
        //caso ocorra o cadastro
        req.files.imagem.mv(__dirname + '/imagens/' + req.files.imagem.name)
        console.log(retorno)
        res.end()
    });



})
//rota para remover produtos
app.get('/remover/:codigo&:imagem', (req, res) => {
    // Sql
    let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`

    //Executando sql
    pool.query(sql, function (erro, retorno) {
        //Caso false o comando sql
        if (erro) throw erro
        //Caso o comando sql funcione
        fs.unlink(__dirname + '/imagens/' + req.params.imagem, (erro_imagem) => {
            console.log('Falha ao remover a imagem')
         
    })
    //Redirecionamento
    res.redirect('/')
})

//rota para editar produto
app.get('/formularioEditar/:codigo', function(req, res){
    console.log(req.params.codigo)
    res.end()
})

// Verifica se existe alguma porta na variaveis de ambiente, caso contrario, utiliza a porta padrão
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('Server online')
})