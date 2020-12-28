const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(
      'mongodb+srv://talalabbas84:12345678910@cluster0.ua5lt.mongodb.net/todo?retryWrites=true&w=majority',
      { useNewUrlParser: true }
    );
  } catch (err) {
    console.error('Error connecting to mongodb');
    console.error(err);
  }
}

module.exports = { connect };
