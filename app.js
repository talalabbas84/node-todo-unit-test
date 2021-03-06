const express = require('express');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require(`morgan`);
const helmet = require('helmet');
const xss = require('xss-clean');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const bodyParser = require('body-parser');
const todoRoutes = require('./routes/todo.routes');
const mysql = require('./model');
const errorHandler = require(`./middleware/error`);
dotenv.config({ path: './config/config.env' });
const { getTodos } = require('./controllers/todo.controller');
const app = express();
const server = http.createServer(app);
// const http = require('http').createServer(app);
// mysql.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and re-sync db.');
// });
// const server = http.createServer(app);

// const io = socketio(server).sockets;
const sio = require('./middleware/socket').init(server);

mysql.sequelize.sync();
app.use(express.json());
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());
// Prevent XSS attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});

app.use(limiter);

//Prevent http param pollution
app.use(hpp());

//Enable CORS
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/todos', todoRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

app.get('/', (req, res) => {
  res.json('Hello world!');
});
// Middleware
// require('./middleware/socket')(io);

app.use(errorHandler);
// module.exports = app;

sio.on('connection', socket => {
  console.log('Connected!');
  socket.emit('connection', null);
  socket.on('initial_data', () => {
    // collection_foodItems.find({}).then(docs => {
    // sio.sockets.emit('get_data', getTodos);
    // });
  });
});

server.listen(5000);
