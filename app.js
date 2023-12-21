// importar modulo express
const express = require('express')
//importa modulo express-handlebars
const { engine } = require('express-handlebars');
//importar modulo de upload
const fileupload = require('express-fileupload')

// importar modulo postgresql
const Pool = require('pg').Pool

const bodyParser = require('body-parser')

//App
const app = express()

//habilitando o upload de arquivos
app.use(fileupload())

//configuração do handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//configuração do banco postgresql
const pool = new Pool ({
    host:'localhost',
    user:'postgres',
    password:'postgres',
    database:'projeto',
    port:5432
})


const PORT = 3000;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
//adicionar bootstrap
app.use('/bootstrap',express.static('./node_modules/bootstrap/dist'))

//adicionar css
app.use('/css', express.static('./css'))

//rota principal
app.get('/', (req, res) => {
    res.render('formulario')
})
//rota de cadastro
app.post('/cadastrar', (req, res) => {
    console.log(req.body)
    res.end()
})
//rota de upload
app.post('/upload', (req, res)=> {
  console.log(req.files.imagem.name); // the uploaded file object
});
//Servidor
app.listen(PORT, () => {
    console.log(`Rodando na porta http://localhost:${PORT}`);
})