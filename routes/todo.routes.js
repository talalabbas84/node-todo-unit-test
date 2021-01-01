const express = require('express');
const todoController = require('../controllers/todo.controller');
const { googleAuth } = require('../middleware/auth');
const todoModel = require('../model/todo.model');
const router = express.Router();

router.post('/login', todoController.getMe);
router.post('/', googleAuth, todoController.createTodo);
router.get('/', googleAuth, todoController.getTodos);
router.get('/:todoId', googleAuth, todoController.getTodoById);
router.put('/:todoId', googleAuth, todoController.updateTodo);
router.delete('/:todoId', googleAuth, todoController.deleteTodo);

module.exports = router;
