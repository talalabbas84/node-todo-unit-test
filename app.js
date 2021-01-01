const express = require('express');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require(`morgan`);
const helmet = require('helmet');
const xss = require('xss-clean');
const path = require('path');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const bodyParser = require('body-parser');
const todoRoutes = require('./routes/todo.routes');
const mysql = require('./model');
const errorHandler = require(`./middleware/error`);
dotenv.config({ path: './config/config.env' });
const app = express();

// mysql.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and re-sync db.');
// });
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

app.use(errorHandler);
module.exports = app;
