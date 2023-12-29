const produtoService = require('../service/produtoService')

exports.buscarTodosProdutos = (request, response) => {
    produtoService.buscarTodosProdutos
    response.status(200).json(results.rows)

}

exports.buscarProdutosPorId = (request, response) => {
    produtoService.buscarProdutosPorId
    response.status(200).json(results.rows)
}

exports.cadastrarProdutos = (request, response) => {
    produtoService.cadastrarProdutos
    response.status(201).send(`Categoria adicionada com ID: ${results.insertId}`)

}

exports.atualizarProdutos = (request, response) => {
    produtoService.atualizarProdutos
    response.status(200).send(`Categoria modificada com  ID: ${id}`)

}

exports.removerCategoria = (request, response) => {
    produtoService.removerProdutos
    response.status(200).send(`Removendo categoria com ID: ${id}`)

}
