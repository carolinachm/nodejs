// importar modulo express
const express = require('express')
//importa modulo express-handlebars
const { engine } = require('express-handlebars');
//importar modulo de upload
const fileupload = require('express-fileupload')

//file-system(manipular arquivos)
const fs = require('fs');

const pool = require('./src/db/configDB').pool
const produtoController = require('./src/controller/produtoController')

//App
const app = express()

//Manipulação de dados via rotas
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//habilitando o upload de arquivos
app.use(fileupload())

// Configuração do express-handlebars
app.engine('handlebars', engine({
    helpers: {
      // Função auxiliar para verificar igualdade
      condicionalIgualdade: function (parametro1, parametro2, options) {
        return parametro1 === parametro2 ? options.fn(this) : options.inverse(this);
      }
    }
  }));
app.set('view engine', 'handlebars');
app.set('views', './views');


const PORT = 3000;


//adicionar bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))

//adicionar css
app.use('/css', express.static('./css'))
//referenciar a pasta de imagem
app.use('/imagens', express.static('./imagens'))
//rota principal
// app.get('/', (req, res) => {
//     res.render('formulario')
// })

//rota de produtos
app.get('/produtos', produtoController.buscarTodosProdutos)
app.get('/produtos/:id', produtoController.buscarProdutosPorId)
app.post('/produtos', produtoController.cadastrarProdutos)
app.put('/produtos/:id', produtoController.atualizarProdutos)
app.delete('/produtos/:id', produtoController.removerProdutos)

//Servidor
app.listen(PORT, () => {
    console.log(`Rodando na porta http://localhost:${PORT}`);
})