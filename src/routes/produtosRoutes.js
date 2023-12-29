const produtoController = require('../controller/produtoController')

//rota para retornar todos os produtos
app.get('/', (req, res) => {
    produtoQueries.buscarTodosProdutos;
});
//rota principal contendo a situação
app.get('/:situacao', (req, res) => {
    //SQL
    let sql = (`SELECT * FROM produtos`)
    //executar o sql
    pool.query(sql, function (erro, retorno) {
        res.render('formulario', { produtos: retorno.rows, situacao: req.params.situacao })
    });
});

//rota de cadastro
app.post('/cadastrar', (req, res) => {
    try {
        //Obter os dados que serão utilizados para o cadastro
        let nome = req.body.nome;
        let descricao = req.body.descricao;
        let categoria = req.body.categoria;
        let valor = req.body.valor;
        let imagem = req.files.imagem.name;

        //validar o nome do produto e valor
        if (nome == '' || descricao == '' || categoria == '' || valor == '' || isNaN(valor)) {
            res.redirect('/falhaCadastro')

        } else {
            produtoQueries.cadastrarProdutos
            //Retorna para tela principal
            res.redirect('/OKCadastro')

        }

    } catch (erro) {
        res.redirect('/falhaCadastro')

    }
})
//rota para remover produtos
app.get('/remover/:codigo&:imagem', (req, res) => {
    //tratativa de exceção
    try {
        produtoQueries.removerProdutos;
        //Redirecionamento
        res.redirect('/OKRemover')

    } catch (erro) {
        res.redirect('/falha ao remover')
    }
})

//rota para editar produto
app.get('/formularioEditar/:codigo', function (req, res) {
    produtoQueries.buscarProdutosPorId;
})


// *************** FUNÇÃO PARA EDITAR OS PRODUTOS
// Rota para editar produtos
app.post('/editar', function (req, res) {

    // Obter os dados do formulário
    let nome = req.body.nome;
    let descricao = req.body.descricao;
    let valor = req.body.valor;
    let codigo = req.body.codigo;
    let nomeImagem = req.body.nomeImagem;

    //validar nome do produto e valor
    if (nome == '' || descricao == '' || valor == '' || isNaN(valor)) {
        res.redirect('/falhaCadastro')

    } else {
        //Definir o tipo de edição
        try {
            //objeto de imagem
            let imagem = req.files.imagem
            produtoQueries.atualizarProdutos
        } catch (erro) {
            //SQL
            let sql = `UPDATE produtos SET nome='${nome}',descricao='${descricao}', valor=${valor} 
        WHERE codigo=${codigo}`;

            //Executar comando sql
            pool.query(sql, function (erro, retorno) {
                //Caso falhe o comando sql
                if (erro) throw erro;
            })

        }

        // Redirecionamento
        res.redirect('/OKEdicao');
    }


});
