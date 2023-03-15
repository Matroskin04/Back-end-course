const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')

let counter = 0;

const FAVICON = path.join(__dirname, 'public', 'favicon.ico')

const server = http.createServer( (request, response) => {

    const pathname = url.parse(request.url).pathname;

    if (request.method === 'GET' && pathname === '/favicon.ico') {

        response.setHeader('Content-Type', 'image/png');

        fs.createReadStream(FAVICON).pipe(response);

        return;
    }

    counter++

    response.write('Counter: ' + counter)

    response.end()

});




server.listen(3001)