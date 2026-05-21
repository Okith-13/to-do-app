const express = require('express');
const { body } = require('express-validator');
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  getStats,
} = require('../controllers/todoController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/', getTodos);

router.post(
  '/',
  [body('title').trim().notEmpty().withMessage('Title is required')],
  createTodo
);

router.put('/:id', updateTodo);
router.patch('/:id/toggle', toggleTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
