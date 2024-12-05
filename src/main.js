const database = require('./database');
const express = require('express')
const app = express()

const HOST = '0.0.0.0'
const PORT = 8080

app.get('/', function (req, res) {
    console.log('usuarios: ' + database.usuarios);
    console.log('likes: ' + database.likes);
    res.status(200).send('successooooooo');
})


app.listen(PORT, () => {
    console.log(`Server runing on: ${HOST}:${PORT}`)
})