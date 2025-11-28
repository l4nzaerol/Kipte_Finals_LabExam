const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      if (userId) {
        socket.join(userId);
      }
    });
  });

  return io;
};

const emitTaskEvent = (userId, payload) => {
  if (io && userId) {
    io.to(userId.toString()).emit('tasks:update', payload);
  }
};

module.exports = { initSocket, emitTaskEvent };

