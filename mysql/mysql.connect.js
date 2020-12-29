module.exports = {
  HOST: 'localhost',
  USER: 'administrator',
  PASSWORD: 'very_strong_password',
  DB: 'todo-db',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
