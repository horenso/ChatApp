require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:4200'],
  },
});
const port = process.env.PORT || 4444;
const jwt = require('jsonwebtoken');

app.use(express.json());

app.set(port, process.env.PORT);

const userList = [];
const tableList = [];

io.use((socket, next) => {
  if (!socket.handshake?.query?.token) {
    next(new Error('No token!'));
  }
  const token = socket.handshake.query.token;
  socket.table = socket.handshake.query.table;

  jwt.verify(
    socket.handshake.query.token,
    process.env.ACCESS_TOKEN_SECRET,
    (error, decoded) => {
      if (error) {
        return next(new Error('Invalid token!'));
      }
      socket.username = decoded;
      next();
    }
  );
});

io.on('connection', (socket) => {
  username = socket.username;

  if (socket.table === '~') {
    console.log(`User ${username} connected to the lobby.`);
  } else {
    console.log(`User ${username} connected to table '${socket.table}'.`);
    socket.join(socket.table);
  }
  console.log(userList);

  socket.on('disconnect', (socket) => {
    console.log(`User ${username} disconnected.`);
    socket.leave(socket.table);
    console.log(userList);
  });

  socket.on('message-to-server', (message) => {
    // Message with more meta data:
    const serverMessage = {
      ...message,
      dateTime: new Date(),
      sender: socket.username,
    };
    io.in(message.table).emit('message-from-server', serverMessage);
    console.log(serverMessage);
  });

  socket.on('create-new-table', (table, callback) => {
    if (tableList.findIndex((ele) => ele.name === table.name) === -1) {
      socket.join(table.name);
      tableList.push(table);
      console.log(tableList);
      console.log(io.sockets.adapter.rooms);
      callback({ joined: true });
    } else {
      callback({
        joined: false,
        message: `Table ${table.name} already exist.`,
      });
    }
  });

  setInterval(() => {
    console.log(io.sockets.adapter.rooms);
  }, 2000);

  socket.on('join-table', (table, callback) => {
    const index = tableList.findIndex((ele) => ele.name === table.name);
    console.log('Size:');
    console.log(Object.keys(io.sockets.adapter.rooms).length);
    if (index === -1) {
      callback({
        joined: false,
        message: `Table ${table.name} does not exist!`,
      });
    } else if (table.size === io.sockets.adapter.rooms.get(table.name).size) {
      callback({
        joined: false,
        message: `Table ${table.name} full!`,
      });
    } else {
      const tablePassword = tableList[index].password;
      if (tablePassword !== '' && tablePassword !== table.password) {
        callback({
          joined: false,
          message: `Password incorrect!`,
        });
      } else {
        socket.join(table.name);
        callback({ joined: true });
      }
      console.log(tableList);
      console.log(io.sockets.adapter.rooms);
    }
  });
});

app.post('/login', (req, res) => {
  const newUserName = req.body.username;
  console.log(req.body);
  console.log(newUserName);
  if (userList.findIndex((ele) => ele === newUserName) !== -1) {
    res.status(403).send(`Username ${newUserName} already taken!`);
    return;
  }
  const username = newUserName.toLowerCase();
  userList.push(username);
  const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
  res.json({ token: accessToken, username: username });
});

http.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
