# propagating-server
sends message to next configured server.

needs nodejs.

## instructions

go to directory

`$ node server.js <port> <url>`

with
- `port` - port this server listens to
- `url` - url of the next server, the one to get the messages. Must contain scheme (`http` or `https`), hostname and port

### example

`$ node server.js 8000 http://localhost:8001`

sending get request to http://localhost:8000/send would therefore let this server send a message to the next configured server, i.e. http://localhost:8001, triggering a message to whichever server is configured next.
