const express = require('express');
const todoRoutes = require('./routes/todo.routes');
const app = express();
const mysql = require('./model');

// mysql.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and re-sync db.');
// });
mysql.sequelize.sync();
app.use(express.json());

app.use('/todos', todoRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

app.get('/', (req, res) => {
  res.json('Hello world!');
});

module.exports = app;
