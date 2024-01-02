// Importar o módulo express
const express = require('express');

// Extraíndo a função Router do módulo express
const router = express.Router();

// Importar módulo de serviços
const produtos_service = require('../../service/produtos/produtos_service');

// *** ADICIONE SUAS ROTAS AQUI

// Rota principal
router.get('/', function (req, res) {
    produtos_service.formularioCadastro(req, res);
  });
  
  // Rota principal contendo a situação
  router.get('/:situacao', function (req, res) {
    produtos_service.formularioCadastroComSituacao(req, res);
  });
  //Rota de listagem
  router.get('/listar/:categoria', function (req, res) {
    produtos_service.listagemProdutos(req, res)
  })
  
  //Rota de pesquisa
  router.post('/pesquisa', function (req, res) {
    produtos_service.pesquisa(req, res);
  })
  
  // Rota de cadastro
  router.post('/cadastrar', function (req, res) {
    produtos_service.cadastrarProduto(req, res);
  });
  
  // Rota para remover produtos
  router.get('/remover/:codigo&:imagem', function (req, res) {
    produtos_service.removerProduto(req, res);
  });
  
  // Rota para redirecionar para o formulário de alteração/edição
  router.get('/formularioEditar/:codigo', function (req, res) {
    produtos_service.formularioEditar(req, res)
  });
  
  // Rota para editar produtos
  router.post('/editar', function (req, res) {
    produtos_service.editarProduto(req,res);
  });

// Exportar o router
module.exports = router;