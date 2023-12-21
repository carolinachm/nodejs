// importar modulo express
const express = require('express')
//App
const app = express()

const PORT = 3000;


//rota Hello world
app.get('', (req, res) => {
    res.send('Hello World')
})
//Servidor
app.listen(PORT, () => {
    console.log(`Rodando na porta http://localhost:${PORT}`);
})