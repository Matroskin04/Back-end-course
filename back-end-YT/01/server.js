var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');

let counter = 0;
var server = http.createServer();

// Location of your favicon in the filesystem.
var FAVICON = path.join(__dirname, 'public', 'favicon.png');

var server = http.createServer(function(req, res) {

    var pathname = url.parse(req.url).pathname;

    if (req.method === 'GET' && pathname === '/favicon.ico') {

        res.setHeader('Content-Type', 'image/png');

        // Serve your favicon and finish response.
        //
        // You don't need to call `.end()` yourself because
        // `pipe` will do it automatically.
        fs.createReadStream(FAVICON).pipe(res);

        return;
    }

        counter++
        res.write('Counter: ' + counter)

        res.end();

});

server.listen(3001)
