const express = require('express');
const Joi = require('joi');
const router = express.Router();

// In-memory storage for demo purposes
let tasks = [
  { id: 1, title: 'Learn Node.js', description: 'Complete Node.js tutorial', completed: false, userId: 1, createdAt: new Date('2024-01-01') },
  { id: 2, title: 'Build API', description: 'Create REST API with Express', completed: true, userId: 1, createdAt: new Date('2024-01-02') },
  { id: 3, title: 'Write Tests', description: 'Add unit tests for API', completed: false, userId: 2, createdAt: new Date('2024-01-03') }
];
let nextId = 4;

// Validation schemas
const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  completed: Joi.boolean().default(false),
  userId: Joi.number().integer().positive().required()
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().max(500),
  completed: Joi.boolean(),
  userId: Joi.number().integer().positive()
});

// GET /api/tasks - Get all tasks with filtering
router.get('/', (req, res) => {
  const { userId, completed, page = 1, limit = 10 } = req.query;
  
  let filteredTasks = tasks;
  
  // Filter by userId
  if (userId) {
    filteredTasks = filteredTasks.filter(task => task.userId === parseInt(userId));
  }
  
  // Filter by completion status
  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
  
  res.json({
    tasks: paginatedTasks,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(filteredTasks.length / limit),
      count: filteredTasks.length
    },
    filters: {
      userId: userId || null,
      completed: completed !== undefined ? completed === 'true' : null
    }
  });
});

// GET /api/tasks/:id - Get task by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  res.json(task);
});

// POST /api/tasks - Create new task
router.post('/', (req, res) => {
  const { error, value } = taskSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }
  
  const newTask = {
    id: nextId++,
    ...value,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update task
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  const { error, value } = updateTaskSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }
  
  tasks[taskIndex] = { 
    ...tasks[taskIndex], 
    ...value,
    updatedAt: new Date()
  };
  
  res.json(tasks[taskIndex]);
});

// PATCH /api/tasks/:id/toggle - Toggle task completion
router.patch('/:id/toggle', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  tasks[taskIndex].updatedAt = new Date();
  
  res.json({
    message: `Task ${tasks[taskIndex].completed ? 'completed' : 'reopened'}`,
    task: tasks[taskIndex]
  });
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.json({ message: 'Task deleted successfully', task: deletedTask });
});

// GET /api/tasks/stats - Get task statistics
router.get('/stats/overview', (req, res) => {
  const { userId } = req.query;
  
  let filteredTasks = tasks;
  if (userId) {
    filteredTasks = filteredTasks.filter(task => task.userId === parseInt(userId));
  }
  
  const stats = {
    total: filteredTasks.length,
    completed: filteredTasks.filter(task => task.completed).length,
    pending: filteredTasks.filter(task => !task.completed).length,
    completionRate: filteredTasks.length > 0 
      ? Math.round((filteredTasks.filter(task => task.completed).length / filteredTasks.length) * 100)
      : 0
  };
  
  res.json(stats);
});

module.exports = router;