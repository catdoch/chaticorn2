// var io = require('socket.io'),
//     http = require('http'),
//     path = require('path'),
//     express = require('express'),
//     app = express(),
//     server = http.createServer(app),
//     port = process.env.PORT || 3000;

// var index = require('./routes/index');

// var app = express();

// /**
//  * Direct app to 
//  * correct paths
//  */
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);

// var chat_room = io.listen(server);
// var usernames = {};

// server.listen(port);


// /**
//  * On connection start events
//  * @param  {socket}
//  * @return undefined
//  */
// chat_room.sockets.on('connection', function(socket) {

//     socket.on('adduser', function(username, colour) {
//         socket.username = username;
//         socket.colour = colour;
//         usernames[username] = username;

//         socket.emit('updatechat', 'SERVER', 'Welcome to the chat!');
//         socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
//         chat_room.sockets.emit('updateusers', usernames);
//     });

//     socket.on('disconnect', function() {
//         delete usernames[socket.username];
//         chat_room.sockets.emit('updateusers', usernames);
//         socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
//     });

//     socket.on('sendchat', function(data) {
//         chat_room.sockets.emit('updatechat', socket.username, data, socket.colour);
//     });
// });

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
