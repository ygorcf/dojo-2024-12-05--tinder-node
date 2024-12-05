const { createServer } = require('node:http')

const HOST = '0.0.0.0'
const PORT = 8080

const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('successooooooo')
})

server.listen(PORT, HOST, () => {
  console.log(`Server runing on: ${HOST}:${PORT}`)
})