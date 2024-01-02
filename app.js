// importar modulo express
const express = require('express')
//importa modulo express-handlebars
const { engine } = require('express-handlebars');
//importar modulo de upload
const fileupload = require('express-fileupload')

//file-system(manipular arquivos)
const fs = require('fs');

//Importar modulo de rotas
const produtosRoute = require('./routes/produtos/produtosRoute');
//App
const app = express();

//Manipulação de dados via rotas
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// Adicionar Bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

// Adicionar CSS
app.use('/css', express.static('./css'));

// Refereniar a pasta de imagens
app.use('/imagens', express.static('./imagens'));

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

app.use('/', produtosRoute);

const PORT = 3000;

//Servidor
app.listen(PORT, () => {
  console.log(`Rodando na porta http://localhost:${PORT}`);
})