const { OAuth2Client } = require('google-auth-library');
const asyncHandler = require('../middleware/async');
const db = require('../model');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const io = require('../middleware/socket.js');
//
// const TodoModel = require('../model/todo.model');

const TodoModel = db.todo;
const Op = db.Sequelize.Op;
exports.createTodo = async (req, res, next) => {
  try {
    const createdModel = await TodoModel.create(req.body);
    if (createdModel) {
      io.getIO().emit('post', {
        action: 'create',
        post: createdModel
      });
      res.status(201).json(createdModel);
    }
  } catch (err) {
    next(err);
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    const allTodos = await TodoModel.findAll({});
    res.status(200).json(allTodos);
  } catch (err) {
    next(err);
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const todoModel = await TodoModel.findByPk(req.params.todoId);
    if (todoModel) {
      res.status(200).json(todoModel);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const updatedTodo = await TodoModel.update(req.body, {
      where: { id: req.params.todoId }
    });
    if (updatedTodo) {
      res.status(200).json(updatedTodo);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const deletedTodo = await TodoModel.destroy({
      where: { id: req.params.todoId }
    });

    if (deletedTodo) {
      io.getIO().emit('post', { action: 'delete', post: deletedTodo });
      res.status(200).json(deletedTodo);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
};
exports.getMe = asyncHandler(async (req, res, next) => {
  console.log('coming here');
  console.log(req.body.token);
  let ticket;
  let token = req.body.token;

  console.log(process.env.GOOGLE_CLIENT_ID);
  try {
    // tuan = await client.getAccessToken();
    // console.log(tuan, 'taaas');

    ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
  } catch (err) {
    console.log(err);
    console.log(err.message);
  }
  console.log(ticket, 'tickerrrrrrrrr');
  const payload = ticket.getPayload();
  console.log(payload);
  if (!payload) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }
  try {
    //Verify token
    req.user = payload;
    console.log('try success');
    return res.status(200).json({
      status: true,
      user: req.user
    });
  } catch (err) {
    console.log(err);
    console.log(err.message);
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }
});
