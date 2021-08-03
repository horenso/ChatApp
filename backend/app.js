const { Socket } = require('dgram');
var express = require('express');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:4200'],
  },
});
const port = process.env.PORT || 4444;
app.set(port, process.env.PORT);

const userList = [];
const tableList = [];

io.use((socket, next) => {
  const newUser = socket.handshake.query.username.toLowerCase();

  if (newUser == undefined) {
    next(new Error('Username not defined!'));
  }
  if (userList.findIndex((ele) => ele === newUser) == -1) {
    socket.username = newUser;
    next();
  } else {
    console.log(`Refused connection, username ${newUser} already taken.`);
    next(new Error('Username taken!'));
  }
});

io.on('connection', (socket) => {
  username = socket.username;
  console.log(`User ${username} connected.`);
  userList.push(username);
  console.log(userList);

  socket.on('disconnect', (socket) => {
    console.log(`User ${username} disconnected.`);

    const index = userList.findIndex((ele) => ele === username);
    userList.splice(index, 1);
    console.log(userList);
  });

  socket.on('message-to-server', (message) => {
    // Message with more meta data:
    const serverMessageBase = {
      ...message,
      dateTime: new Date(),
    };
    const serverMessageBroadcast = {
      ...serverMessageBase,
      sender: socket.username,
    };
    const serverMessageSelf = {
      ...serverMessageBase,
      sender: 'You',
    };
    socket
      .to(message.table)
      .emit('message-from-server', serverMessageBroadcast);
    io.to(socket.id).emit('message-from-server', serverMessageSelf);
    console.log(serverMessageBroadcast);
  });

  socket.on('create-new-table', (table, callback) => {
    const tableName = table.name;
    if (tableList.findIndex((ele) => ele === tableName) === -1) {
      socket.join(tableName);
      tableList.push(tableName);
      console.log(tableList);
      console.log(io.sockets.adapter.rooms);
      callback({ joined: true });
    } else {
      callback({ joined: false, message: `Table ${tableName} already exist.` });
    }
  });

  socket.on('join-table', (table, callback) => {
    const tableName = table.name;
    if (tableList.findIndex((ele) => ele === tableName) === -1) {
      callback({
        joined: false,
        message: `Table ${tableName} does not exist.`,
      });
    } else {
      socket.join(tableName);
      callback({ joined: true });
    }
    console.log(tableList);
    console.log(io.sockets.adapter.rooms);
  });
});

http.listen(port, () => {
  console.log(`listening on ${port}`);
});
