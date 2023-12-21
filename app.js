// importar modulo express
const express = require('express')
import { engine } from 'express-handlebars';

// importar modulo postgresql
const Pool = require('pg').Pool

const bodyParser = require('body-parser')

//App
const app = express()
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

//rota Hello world
app.get('', (req, res) => {
    res.send('Hello World')
})
//Servidor
app.listen(PORT, () => {
    console.log(`Rodando na porta http://localhost:${PORT}`);
})