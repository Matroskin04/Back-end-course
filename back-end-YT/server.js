const http = require('http')

let counter = 0;


const server = http.createServer( (request, response) => {

    if (request.url === '/favicon.ico') {
        response.writeHead(200, {'Content-Type': image/x-icon})
        response.end()
        return;
    }

    counter++

    response.write('Counter: ' + counter)

    response.end()
    })

server.listen(3001)