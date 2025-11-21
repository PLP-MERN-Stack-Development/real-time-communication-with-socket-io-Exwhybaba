// server/config/socket.js
import { loadMessages, saveMessages, loadUsers, saveUsers } from '../storage.js';

export const configureSocket = (io) => {
  let messages = {};
  let users = {};

  // Load persisted data on server start
  (async () => {
    messages = await loadMessages();
    users = await loadUsers();
  })();

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Add user
    socket.on('join', (username) => {
      users[socket.id] = username;
      io.emit('users', Object.values(users));
    });

    // Receive chat message
    socket.on('message', async ({ room, message, sender }) => {
      if (!messages[room]) messages[room] = [];
      const msg = { id: Date.now(), sender, message, timestamp: new Date().toISOString() };
      messages[room].push(msg);

      io.to(room).emit('message', msg);
      await saveMessages(messages);
    });

    // Join room
    socket.on('joinRoom', (room) => {
      socket.join(room);
    });

    // Typing indicator
    socket.on('typing', ({ room, username, isTyping }) => {
      socket.to(room).emit('typing', { username, isTyping });
    });

    // Private messages
    socket.on('privateMessage', ({ toUsername, message, sender }) => {
      const recipientSocketId = Object.keys(users).find(id => users[id] === toUsername);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('privateMessage', { sender, message });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);
      delete users[socket.id];
      io.emit('users', Object.values(users));
      await saveUsers(users);
    });
  });
};
