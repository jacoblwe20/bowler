var http    = require('http'),
    fs      = require('fs'),
    path    = require('path'),
    port    = process.env.PORT || 3000;
 
http.createServer(function (request, response) {
 
    request.query = (function(){
        var data = request.url.split('?')[1];
        if(data){
            data = data.split('&');
            var obj = {};
            for(var i = 0; i < data.length; i += 1){
                var values = data[i].split('=');
                obj[values[0]] = values[1];
            }
            return obj;
        }
    }());

    request.url = request.url.replace(request.url.split('?')[1], '');
     
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';
         
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    var status;
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    };
    var done = function(){
        console.log('\033[30m' + request.method +' http://127.0.0.1' + port + '\033[36m' + request.url + '\033[32m ' + status + '\033[0m');
    };
     
    fs.exists(filePath, function(exists) {
     
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    status = 500;
                    response.writeHead(500);
                    response.end();
                    done();
                }
                else {
                    status = 200;
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                    done();
                }
            });
        }
        else {
            status = 200;
            response.writeHead(404);
            response.end();
            done();
        }
    });
     
}).listen(port);
 
console.log('\033[30mServer running at \033[36m http://127.0.0.1:' + port + '\033[0m');