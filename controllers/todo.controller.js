const db = require('../model');
//
// const TodoModel = require('../model/todo.model');

const TodoModel = db.todo;
const Op = db.Sequelize.Op;
exports.createTodo = async (req, res, next) => {
  try {
    const createdModel = await TodoModel.create(req.body);
    res.status(201).json(createdModel);
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
      res.status(200).json(deletedTodo);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
};
