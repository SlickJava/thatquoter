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
var currentQuote = null;
var quoteHistory = [];

io.on('connection', function(socket) {

  var name;

  socket.on('sendname', function(data) {
    name = data;
  });


  socket.on('sendquote', function(data) {
    if (name != null) {
      data = '\'' + data + '\'' + ' - ' + name;
      currentQuote = data;
      io.sockets.emit('newquote', data);
      quoteHistory.unshift(data);
      console.log(quoteHistory);

      if (quoteHistory.length > 10) {
        quoteHistory.pop();
      }

      io.sockets.emit('quotehistory', quoteHistory);

      var count = 0;
      socket.on('like', function(data) {
        console.log(data);
        count += 1;
        io.sockets.emit('newlike', count);
      });
    }
  });


  if (currentQuote != null) {
    socket.emit('newquote', currentQuote);
  }
  
  if(quoteHistory != null) {
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
