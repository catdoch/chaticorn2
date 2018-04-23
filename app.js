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

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});