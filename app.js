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

//rota para retornar todos os produtos
app.get('/', (req, res) => {
    //SQL
    let sql = (`SELECT * FROM produtos`)
    //executar o sql
    pool.query(sql, function (erro, retorno) {
        res.render('formulario', { produtos: retorno.rows })
    });
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
        let valor = req.body.valor;
        let imagem = req.files.imagem.name;

        //validar o nome do produto e valor
        if (nome == '' || descricao == '' || valor == '' || isNaN(valor)) {
            res.redirect('/falhaCadastro')

        } else {
            //SQL
            let sql = `INSERT INTO produtos(nome, descricao, valor, imagem) VALUES ('${nome}', '${descricao}', ${valor}, '${imagem}')`;

            //executar o sql
            pool.query(sql, function (erro, retorno) {
                if (erro) throw erro;
                //caso ocorra o cadastro
                req.files.imagem.mv(__dirname + '/imagens/' + req.files.imagem.name)
                console.log(retorno)

            });

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
        //Redirecionamento
        res.redirect('/OKRemover')

    } catch (erro) {
        res.redirect('/falha ao remover')
    }
})

//rota para editar produto
app.get('/formularioEditar/:codigo', function (req, res) {
    //SQL
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;

    //Executar o sql
    pool.query(sql, function (erro, retorno) {
        //caso aja erro
        if (erro) throw erro
        //Caso de certo
        res.render('formularioEditar', { produto: retorno[0] })
    })
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


//Servidor
app.listen(PORT, () => {
    console.log(`Rodando na porta http://localhost:${PORT}`);
})