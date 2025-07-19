const express = require('express');
const Joi = require('joi');
const router = express.Router();

// In-memory storage for demo purposes
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
];
let nextId = 4;

// Validation schemas
const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(1).max(120).required()
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  age: Joi.number().integer().min(1).max(120)
});

// GET /api/users - Get all users
router.get('/', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedUsers = users.slice(startIndex, endIndex);
  
  res.json({
    users: paginatedUsers,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(users.length / limit),
      count: users.length
    }
  });
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json(user);
});

// POST /api/users - Create new user
router.post('/', (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }
  
  // Check if email already exists
  const existingUser = users.find(u => u.email === value.email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email already exists' });
  }
  
  const newUser = {
    id: nextId++,
    ...value
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /api/users/:id - Update user
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const { error, value } = updateUserSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }
  
  // Check if email already exists (excluding current user)
  if (value.email) {
    const existingUser = users.find(u => u.email === value.email && u.id !== id);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }
  }
  
  users[userIndex] = { ...users[userIndex], ...value };
  res.json(users[userIndex]);
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  res.json({ message: 'User deleted successfully', user: deletedUser });
});

module.exports = router;