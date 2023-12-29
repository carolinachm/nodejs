
const buscarTodosProdutos = (request, response) => {
    //SQL
    let sql = (`SELECT * FROM produtos`)
    //executar o sql
    pool.query(sql, function (erro, retorno) {
        res.render('formulario', { produtos: retorno.rows })
    });
}

const buscarProdutosPorId = (request, response) => {
  //SQL
  let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;

  //Executar o sql
  pool.query(sql, function (erro, retorno) {
      //caso aja erro
      if (erro) throw erro
      //Caso de certo
      res.render('formularioEditar', { produto: retorno[0] })
  })
}

const cadastrarProdutos = (request, response) => {
    //SQL
    let sql = `INSERT INTO produtos(nome, descricao, categoria, valor,  imagem) 
   VALUES ('${nome}', '${descricao}','${categoria}', ${valor}, '${imagem}')`;

    //executar o sql
    pool.query(sql, function (erro, retorno) {
        if (erro) throw erro;
        //caso ocorra o cadastro
        req.files.imagem.mv(__dirname + '/imagens/' + req.files.imagem.name)
        console.log(retorno)

    });
}

const atualizarProdutos = (request, response) => {
    // SQL
    let sql = `UPDATE produtos SET nome='${nome}',descricao='${descricao}', valor=${valor}, imagem='${imagem}' 
    WHERE codigo=${codigo}`;
    //executar comando sql
    pool.query(sql, function (erro, retorno) {
        //caso falhe o comando sql
        if (erro) throw erro
        //remover imagem antiga
        fs.unlink(__dirname + '/imagens' + nomeImagem, (erro_imagem) => {
            console.log('Falha ao remover a imagem')
        })
        //Cadastrar nova imagem
        imagem.mv(__dirname + '/imagens/' + imagem.name);
    })
}

const removerProdutos = (request, response) => {
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
    })
}
module.exports = {
    buscarTodosProdutos,
    buscarProdutosPorId,
    cadastrarProdutos,
    atualizarProdutos,
    removerProdutos,
}