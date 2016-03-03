  var envSet = true;
  var url = require('url');
  if (!process.argv[2] || !process.argv[3]) {
    envSet = false;
  } else {
    var port = Number(process.argv[2]), nextServer = url.parse(process.argv[3]);
  }
  if (isNaN(port) || port > 9999 || port < 0 || !nextServer) {
    envSet = false;
  } 

  if (envSet) {
    var util = require('util'), http = require('http');

    console.log('Next server is ' + nextServer['hostname'] + ":" + nextServer.port);

    function sendToNextServer(req, res) {
      var postData = 
      JSON.stringify({foo: 'bar'});
      ;

      var options = {
        hostname: nextServer.hostname,
        port: nextServer.port,
        path: '/receive',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': postData.length
        }
      };

      var req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
          console.log('No more data in response.')
        })
      });

      req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
      });
      
          // write data to request body
          req.write(postData);
          req.end('');

          res.writeHead(200);
          res.end();
        };

        function receiveSomething(req, res) {
          console.log("[200] " + req.method + " to " + req.url);

          req.on('data', function(chunk) {
            console.log("Received body data:");
            console.log(chunk.toString());
          });
          
          req.on('end', function() {
            // empty 200 OK response for now
            res.writeHead(200, "OK", {'Content-Type': 'text/html'});
            res.end();
          });
        };

        var httpServer = http.createServer(function(req, res) {
          var path = req.url;
          if (path == '/send') {
            sendToNextServer(req, res);
          } else if (path == '/receive') { 
            receiveSomething(req, res);
            sendToNextServer(req, res);
          } else if (path == '/foo') {
            console.log('foo');
            res.writeHead(200);
            res.end('');
          } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('not implemented');
          }
        }).listen(port);

        console.log('Hello, I am listening on port: ' + port);
      } else {
        console.log('port must be integer between 0 and 9999')
        console.log('url must be a valid url to a server or service')
      }