//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];

var quoteObj = require('./quote');
var clientSession = require('./user')

var currentQuote = new quoteObj('Jason', 'Added a like system');
var quoteHistory = [];

io.on('connection', function(socket) {

  var name;
  var sessions = [];
  
  console.log("Client with id: " + socket.id + " connected.");
  var newSession = new clientSession(socket.id);
  sessions.unshift(newSession);
  
  socket.on('sendname', function(data) {
    name = data;
  });


  socket.on('sendquote', function(data) {
    if (name != null) {
      var newQuote = new quoteObj(name, data, this.id);
      console.log(this.id);
      currentQuote = newQuote;
      io.sockets.emit('newquote', newQuote);

      quoteHistory.unshift(newQuote);
      console.log(quoteHistory);

      if (quoteHistory.length > 10) {
        quoteHistory.pop();
      }

      io.sockets.emit('quotehistory', quoteHistory);

    }
  });

  socket.on('like', function(data) {
    currentQuote.like += 1;
    io.sockets.emit('newlike', currentQuote);
    quoteHistory.shift();
    quoteHistory.unshift(currentQuote);
    io.sockets.emit('quotehistory', quoteHistory);
  });


  if (currentQuote != null) {
    socket.emit('newquote', currentQuote);
    socket.emit('newlike', currentQuote);

  }

  if (quoteHistory != null) {
    socket.emit('quotehistory', quoteHistory);
  }

});


function broadcast(event, data) {
  sockets.forEach(function(socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Quote server listening at", addr.address + ":" + addr.port);
});
