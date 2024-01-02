const pool = require('../../db/configDB').pool
// Importar o módulo file system
const fs = require('fs');

//Função para exibir o formulário para cadastro de produtos
function formularioCadastro(req, res){
    // SQL
  let sql = 'SELECT * FROM produtos';

  // Executar comando SQL
  pool.query(sql, function (erro, retorno) {
    res.render('formulario', { produtos: retorno.rows });
  });
}

// Função para exibir o formulário para cadastro de produtos e a situação
function formularioCadastroComSituacao(req, res){
      // SQL
  let sql = 'SELECT * FROM produtos';

  // Executar comando SQL
  pool.query(sql, function (erro, retorno) {
    res.render('formulario', { produtos: retorno.rows, situacao: req.params.situacao });
  });
}

// Função para exibir o formulário para edição de produtos
function formularioEditar(req, res){
     // SQL
  let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;

  // Executar o comando SQL
  pool.query(sql, function (erro, retorno) {
    // Caso haja falha no comando SQL
    if (erro) throw erro;

    // Caso consiga executar o comando SQL
    res.render('formularioEditar', { produto: retorno[0].rows});
  });
}

// Função para exibir a listagem de produtos
function listagemProdutos(req, res){
     //obter categoria
  let categoria = req.params.categoria;

  //sql
  let sql = '';

  if(categoria == 'todos'){
    sql = `SELECT * FROM produtos ORDER BY RAND()`;
  }else{
    sql = `SELECT * FROM produtos WHERE categoria = '${categoria}' ORDER BY nome ASC`;
  }
  //Executar comando sql
  pool.query(sql, function(erro, retorno){
    res.render('listar', {produtos: retorno})
  })
}

// Função para realizar a pesquisa de produtos
function pesquisa(req, res){
    //Obter o termo pesquisado
  let termo = req.body.termo;
  //SQL
  let sql = `SELECT * FROM produtos WHERE nome LIKE '%${termo}%'`;
  //Executar o comando sql
  pool.query(sql, function (erro, retorno) {

    let semRegistros = retorno.length == 0 ? true : false;

    res.render('listar', { produtos: retorno.rows, semRegistros:semRegistros});
  });
}

// Função para realizar o cadastro de produtos
function cadastrarProduto(req, res){
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
}

// Função para realizar a remoção de produtos
function removerProduto(req, res){
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

}

// Função responsável pela edição de produtos
function editarProduto(req, res){
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
}

// Exportar funções
module.exports = {
    formularioCadastro,
    formularioCadastroComSituacao,
    formularioEditar,
    listagemProdutos,
    pesquisa,
    cadastrarProduto,
    removerProduto,
    editarProduto
};