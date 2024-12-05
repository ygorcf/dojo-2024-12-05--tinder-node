const express = require('express')
const app = express()

const HOST = '0.0.0.0'
const PORT = 8080

app.get('/', function (req, res) {
    res.status(200).send('successooooooo')
})


app.listen(PORT, () => {
    console.log(`Server runing on: ${HOST}:${PORT}`)
})