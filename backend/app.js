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

app.post('/login', (req, res) => {
  const newUserName = req.body.username;
  console.log(req.body);
  console.log(newUserName);
  if (userList.findIndex((ele) => ele === newUserName) !== -1) {
    res.status(403).send('Username already taken!');
    return;
  }
  const username = newUserName.toLowerCase();
  userList.push(username);
  const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
  res.json({ token: accessToken, username: username });
});

app.get('/hi', (req, res) => {});

// app.listen(port, () => {
//   console.log(`Express is listening on ${port}`);
// });

http.listen(port, () => {
  console.log(`App is listening on ${port}`);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.splice(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}
