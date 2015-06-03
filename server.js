var http = require('http');
var Primus = require('primus');

var cfg = require('envigor')();

var pool = require('./app/pool.js')(cfg);
var appHttp = require('./app/http.js')(cfg, pool);
var appSocket= require('./app/socket.js')(cfg, pool);

var httpServer=require('http').createServer(appHttp);
httpServer.listen(process.env.PORT || 5000, process.env.IP || '0.0.0.0');

var socketServer = new Primus(httpServer, {transformer: 'engine.io'});
socketServer.on('connection', appSocket);
