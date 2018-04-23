const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const React = require('react');
const App = require('./build/static/js/Main.js').default;
const { renderToString } = require('react-dom/server');

const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);

app.get('/', (req, res) => {
  const htmlPath = path.resolve(__dirname, 'build', 'index.html');

  fs.readFile(htmlPath, 'utf8', (err, html) => {
    const rootElem = '<div id="root">';
    const renderedApp = renderToString(React.createElement(App, null));

    res.send(html.replace(rootElem, rootElem + renderedApp));
  });
});

app.use(express.static('build'));

let usernames = [];

io.on('connection', (socket) => {
  socket.on('adduser', (username, colour) => {
    socket.username = username;
    socket.colour = colour;
    usernames.push({name: username});
    const initialChat = {username: 'SERVER', message: 'Welcome to the chat'};
    const connectedUser = {username: 'SERVER', message: `${username} has connected`};

    socket.emit('updatechat', initialChat);
    socket.broadcast.emit('updatechat', connectedUser);
    io.emit('updateusers', usernames);
  });

  socket.on('sendchat', (data) => {
    const chat = { username: socket.username, message: data, colour: socket.colour }
    io.emit('updatechat', chat);
  });

  socket.on('disconnect', () => {
    const chat = { username: 'SERVER', message: `${socket.username} has disconnected`};

    const updateUsers = usernames.filter((word) => word.name !== socket.username);
  
    io.emit('updateusers', updateUsers);
    socket.broadcast.emit('updatechat', chat);
    console.log('disconnected');
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});








// var socketIO = require('socket.io'),
//     http = require('http'),
//     express = require('express'),
//     app = express(),
//     server = http.createServer(app),
//     port = process.env.PORT || 3000;

//   const io = socketIO.listen(server);
//   const { renderToString } = require('react-dom/server');
//   const path = require('path');
//   const fs = require('fs');

// const React = require('react');
// const App = require('./transpiled/Main.js').default;

//   app.get('/', (req, res) => {
//     const htmlPath = path.resolve(__dirname, 'build', 'index.html');
  
//     fs.readFile(htmlPath, 'utf8', (err, html) => {
//       const rootElem = '<div id="root">';
//       const renderedApp = renderToString(React.createElement(App, null));
  
//       res.send(html.replace(rootElem, rootElem + renderedApp));
//     });
//   });

// /**
//  * Direct app to 
//  * correct paths
//  */
// app.use('static', express.static('build'));



// // var chat_room = io.listen(server);
// //const usernames = {};

// // This creates our socket using the instance of the server


// // This is what the socket.io syntax is like, we will work this later
// io.on('connection', (socket) => {
//   console.log('connect');
//   // socket.on('adduser', function(username, colour) {
//   //     socket.username = username;
//   //     socket.colour = colour;
//   //     usernames[username] = username;

//   //     socket.emit('updatechat', 'SERVER', 'Welcome to the chat!');
//   //     socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
//   //     chat_room.sockets.emit('updateusers', usernames);
//   // });

//   socket.on('disconnect', function() {
//       // delete usernames[socket.username];
//       // chat_room.sockets.emit('updateusers', usernames);
//       // socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
//       console.log('disconnected');
//   });

//   // socket.on('sendchat', function(data) {
//   //     chat_room.sockets.emit('updatechat', socket.username, data, socket.colour);
//   // });
// });

// server.listen(port);

// //server.listen(port, () => console.log(`Listening on port ${port}`))


// // /**
// //  * On connection start events
// //  * @param  {socket}
// //  * @return undefined
// //  */
// // chat_room.sockets.on('connection', function(socket) {
// //   console.log('connect');
// //     socket.on('adduser', function(username, colour) {
// //         socket.username = username;
// //         socket.colour = colour;
// //         usernames[username] = username;

// //         socket.emit('updatechat', 'SERVER', 'Welcome to the chat!');
// //         socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
// //         chat_room.sockets.emit('updateusers', usernames);
// //     });

// //     socket.on('disconnect', function() {
// //         delete usernames[socket.username];
// //         chat_room.sockets.emit('updateusers', usernames);
// //         socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
// //     });

// //     socket.on('sendchat', function(data) {
// //         chat_room.sockets.emit('updatechat', socket.username, data, socket.colour);
// //     });
// // });