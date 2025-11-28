const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const { emitTaskEvent } = require('../services/socketService');

const router = express.Router();

const validations = [
  body('title').notEmpty().withMessage('Title required'),
  body('category').optional().isIn(['practice', 'match', 'fitness', 'equipment']),
  body('intensity').optional().isIn(['low', 'medium', 'high']),
];

router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ tasks });
});

router.post('/', auth, validations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const payload = { ...req.body, user: req.user.id };
  const task = await Task.create(payload);
  emitTaskEvent(req.user.id, { type: 'created', task });
  res.status(201).json({ task });
});

router.put('/:id', auth, validations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );

  if (!task) return res.status(404).json({ message: 'Task not found' });
  emitTaskEvent(req.user.id, { type: 'updated', task });
  res.json({ task });
});

router.delete('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  emitTaskEvent(req.user.id, { type: 'deleted', taskId: req.params.id });
  res.json({ message: 'Task removed' });
});

module.exports = router;

