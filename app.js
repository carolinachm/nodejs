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
const app = express();

//Manipulação de dados via rotas
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//habilitando o upload de arquivos
app.use(fileupload())

// Adicionar Bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

// Adicionar CSS
app.use('/css', express.static('./public/css'));

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

// Rota principal
app.get('/', function (req, res) {
  // SQL
  let sql = 'SELECT * FROM produtos';

  // Executar comando SQL
  pool.query(sql, function (erro, retorno) {
    res.render('formulario', { produtos: retorno.rows });
  });
});

// Rota principal contendo a situação
app.get('/:situacao', function (req, res) {
  // SQL
  let sql = 'SELECT * FROM produtos';

  // Executar comando SQL
  pool.query(sql, function (erro, retorno) {
    res.render('formulario', { produtos: retorno.rows, situacao: req.params.situacao });
  });
});
//Rota de listagem
app.get('/listar/:categoria', function (req, res){
  //obter categoria
  let categoria = req.params.categoria;

  //sql
  let sql = '';

  if(categoria == 'todos'){
    sql = `SELECT * FROM produtos`;
  }else{
    sql = `SELECT * FROM produtos WHERE categoria = '${categoria}'`;
  }
  //Executar comando sql
  pool.query(sql, function(erro, retorno){
    res.render('listar', {produtos: retorno.rows})
  })
})

//Rota de pesquisa
app.post('/pesquisa', function (req, res) {
  //Obter o termo pesquisado
  let termo = req.body.termo;
  //SQL
  let sql = `SELECT * FROM produtos WHERE nome LIKE '%${termo}%'`;
  //Executar o comando sql
  pool.query(sql, function (erro, retorno) {
    res.render('listar', { produtos: retorno.rows});
  });

  

})

// Rota de cadastro
app.post('/cadastrar', function (req, res) {
  try {
    // Obter os dados que serão utiliados para o cadastro
    let nome = req.body.nome;
    let descricao = req.body.descricao
    let valor = req.body.valor;
    let categoria = req.body.categoria;
    let imagem = req.files.imagem.name;

    // Validar o nome do produto e o valor
    if (nome == '' || descricao == '' || valor == '' || isNaN(valor) || categoria == '') {
      res.redirect('/falhaCadastro');
    } else {
      // SQL
      let sql = `INSERT INTO produtos (nome,descricao,valor,imagem,categoria) VALUES ('${nome}','${descricao}', ${valor}, '${imagem}', '${categoria}')`;

      // Executar comando SQL
      pool.query(sql, function (erro, retorno) {
        // Caso ocorra algum erro
        if (erro) throw erro;

        // Caso ocorra o cadastro
        req.files.imagem.mv(__dirname + '/imagens/' + req.files.imagem.name);
        console.log(retorno);
      });

      // Retornar para a rota principal
      res.redirect('/okCadastro');
    }
  } catch (erro) {
    res.redirect('/falhaCadastro');
  }
});

// Rota para remover produtos
app.get('/remover/:codigo&:imagem', function (req, res) {

  // Tratamento de exeção
  try {
    // SQL
    let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;

    // Executar o comando SQL
    pool.query(sql, function (erro, retorno) {
      // Caso falhe o comando SQL
      if (erro) throw erro;

      // Caso o comando SQL funcione
      fs.unlink(__dirname + '/imagens/' + req.params.imagem, (erro_imagem) => {
        console.log('Falha ao remover a imagem');
      });
    });

    // Redirecionamento
    res.redirect('/okRemover');
  } catch (erro) {
    res.redirect('/falhaRemover');
  }

});

// Rota para redirecionar para o formulário de alteração/edição
app.get('/formularioEditar/:codigo', function (req, res) {

  // SQL
  let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;

  // Executar o comando SQL
  pool.query(sql, function (erro, retorno) {
    // Caso haja falha no comando SQL
    if (erro) throw erro;

    // Caso consiga executar o comando SQL
    res.render('formularioEditar', { produto: retorno[0].rows});
  });

});

// Rota para editar produtos
app.post('/editar', function (req, res) {

  // Obter os dados do formulário
  let codigo = req.body.codigo;
  let nome = req.body.nome;
  let descricao = req.body.descricao;
  let valor = req.body.valor;
  let nomeImagem = req.body.nomeImagem;

  // Validar nome do produto e valor
  if (nome == '' || valor == '' || isNaN(valor)) {
    res.redirect('/falhaEdicao');
  } else {

    // Definir o tipo de edição
    try {
      // Objeto de imagem
      let imagem = req.files.imagem;

      // SQL
      let sql = `UPDATE produtos SET nome='${nome}', descricao='${descricao}', valor=${valor}, imagem='${imagem.nome}' WHERE codigo=${codigo}`;

      // Executar comando SQL
      conexao.query(sql, function (erro, retorno) {
        // Caso falhe o comando SQL
        if (erro) throw erro;

        // Remover imagem antiga
        fs.unlink(__dirname + '/imagens/' + nomeImagem, (erro_imagem) => {
          console.log('Falha ao remover a imagem.');
        });

        // Cadastrar nova imagem
        imagem.mv(__dirname + '/imagens/' + imagem.nome);
      });
    } catch (erro) {

      // SQL
      let sql = `UPDATE produtos SET nome='${nome}',descricao='${descricao}', valor=${valor} WHERE codigo=${codigo}`;

      // Executar comando SQL
      pool.query(sql, function (erro, retorno) {
        // Caso falhe o comando SQL
        if (erro) throw erro;
      });
    }

    // Redirecionamento
    res.redirect('/okEdicao');
  }
});


const PORT = 3000;

//Servidor
app.listen(PORT, () => {
  console.log(`Rodando na porta http://localhost:${PORT}`);
})