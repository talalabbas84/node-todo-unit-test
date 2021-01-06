const app = require('./app');
const http = require('http').createServer(app);
const socket = require('socket.io')(http);
const server = app.listen(5000, () => {
  console.log('Server is now running!');
});
const io = socket.listen(server, { origins: '*:*' });
// socket.origins('*:*');

io.on('connection', socket => {
  /* socket object may be used to send specific messages to the new connected client */

  console.log('new client connected');
  socket.emit('connection', null);
});
