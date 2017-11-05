var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

// io.on('connection', function(socket){
//   console.log('a user connected');
//   io.emit('chat message', socket.id);
//   console.log(socket.id);
// });

// Routing
app.use(express.static(path.join(__dirname, './')));

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    console.log(data);
    console.log(socket.username)
    console.log(socket)
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    console.log('Trying to add user')
    if (addedUser) return;

    // we store the username in the socket session for this client
    console.log(username)
    console.log(socket)
    socket.username = username;
    //++numUsers;
    addedUser = true;
    // socket.emit('login', {
    //   numUsers: numUsers
    // });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
    });
  });
});
// io.on('connection', function(socket){
//   socket.broadcast.emit('hi');
// });
