const { validationResult } = require('express-validator');
const Todo = require('../models/Todo');

// @desc  Get all todos for logged-in user
// @route GET /api/todos
const getTodos = async (req, res, next) => {
  try {
    const { completed, priority, tag, sort = '-createdAt' } = req.query;
    const filter = { user: req.user._id };

    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;
    if (tag) filter.tags = tag;

    const todos = await Todo.find(filter).sort(sort);
    res.json(todos);
  } catch (err) {
    next(err);
  }
};

// @desc  Create a todo
// @route POST /api/todos
const createTodo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { title, description, priority, dueDate, tags } = req.body;
    const todo = await Todo.create({
      user: req.user._id,
      title,
      description,
      priority,
      dueDate,
      tags,
    });

    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
};

// @desc  Update a todo
// @route PUT /api/todos/:id
const updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const allowed = ['title', 'description', 'completed', 'priority', 'dueDate', 'tags'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) todo[field] = req.body[field];
    });

    await todo.save();
    res.json(todo);
  } catch (err) {
    next(err);
  }
};

// @desc  Delete a todo
// @route DELETE /api/todos/:id
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc  Toggle todo completion
// @route PATCH /api/todos/:id/toggle
const toggleTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    next(err);
  }
};

// @desc  Get stats
// @route GET /api/todos/stats
const getStats = async (req, res, next) => {
  try {
    const [total, completed, high, medium, low] = await Promise.all([
      Todo.countDocuments({ user: req.user._id }),
      Todo.countDocuments({ user: req.user._id, completed: true }),
      Todo.countDocuments({ user: req.user._id, priority: 'high', completed: false }),
      Todo.countDocuments({ user: req.user._id, priority: 'medium', completed: false }),
      Todo.countDocuments({ user: req.user._id, priority: 'low', completed: false }),
    ]);
    res.json({ total, completed, pending: total - completed, byPriority: { high, medium, low } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo, toggleTodo, getStats };
