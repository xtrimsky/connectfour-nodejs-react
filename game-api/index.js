var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3001);

app.get('/', function(req, res){
  res.send('<h1>API only</h1>');
});

var GameControllerClass = require("./GameController.js");
var GameController = new GameControllerClass(io);