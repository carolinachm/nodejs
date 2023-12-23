// importar modulo express
const express = require('express')
//importa modulo express-handlebars
const { engine } = require('express-handlebars');
//importar modulo de upload
const fileupload = require('express-fileupload')

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


const PORT = 3000;


//adicionar bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))

//adicionar css
app.use('/css', express.static('./css'))
//referenciar a pasta de imagem
app.use('imagens',express.static('./imagens'))
//rota principal
// app.get('/', (req, res) => {
//     res.render('formulario')
// })

//rota para retornar todos os produtos
app.get('/', (req, res) => {
    //SQL
    let sql = (`SELECT * FROM produtos`)
    //executar o sql
    pool.query(sql, function (erro, retorno) {
        res.render('formulario', {produtos: retorno})
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
app.get('/remover/:codigo&:imagem', (req, res)=>{
    console.log(req.params.codigo)
    console.log(req.params.imagem)
    res.end()
})

//Servidor
app.listen(PORT, () => {
    console.log(`Rodando na porta http://localhost:${PORT}`);
})