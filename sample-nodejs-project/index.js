const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const sqlite3 = require('sqlite3').verbose();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your_jwt_secret';

// DB setup
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
  db.run(`CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    userId INTEGER,
    createdAt TEXT,
    updatedAt TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);
});

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Sample CRUD API', version: '1.0.0' },
  },
  apis: ['./index.js'],
});

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Helper: authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// User registration
app.post('/register', async (req, res, next) => {
  const schema = Joi.object({ username: Joi.string().required(), password: Joi.string().min(4).required() });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], function(err) {
    if (err) return res.status(400).json({ error: 'Username already exists' });
    res.status(201).json({ id: this.lastID, username });
  });
});

// User login
app.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// CRUD for items (protected)
app.post('/items', authenticateToken, (req, res, next) => {
  const schema = Joi.object({ name: Joi.string().required() });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { name } = req.body;
  const now = new Date().toISOString();
  db.run('INSERT INTO items (name, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?)', [name, req.user.id, now, now], function(err) {
    if (err) return next(err);
    db.get('SELECT * FROM items WHERE id = ?', [this.lastID], (err, item) => {
      if (err) return next(err);
      res.status(201).json(item);
    });
  });
});

// Pagination, filtering, and ownership
app.get('/items', authenticateToken, (req, res, next) => {
  const { page = 1, limit = 10, name } = req.query;
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM items WHERE userId = ?';
  let params = [req.user.id];
  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));
  db.all(query, params, (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

app.get('/items/:id', authenticateToken, (req, res, next) => {
  db.get('SELECT * FROM items WHERE id = ? AND userId = ?', [req.params.id, req.user.id], (err, item) => {
    if (err) return next(err);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  });
});

app.put('/items/:id', authenticateToken, (req, res, next) => {
  const schema = Joi.object({ name: Joi.string().required() });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { name } = req.body;
  const now = new Date().toISOString();
  db.run('UPDATE items SET name = ?, updatedAt = ? WHERE id = ? AND userId = ?', [name, now, req.params.id, req.user.id], function(err) {
    if (err) return next(err);
    if (this.changes === 0) return res.status(404).json({ error: 'Item not found' });
    db.get('SELECT * FROM items WHERE id = ?', [req.params.id], (err, item) => {
      if (err) return next(err);
      res.json(item);
    });
  });
});

app.delete('/items/:id', authenticateToken, (req, res, next) => {
  db.get('SELECT * FROM items WHERE id = ? AND userId = ?', [req.params.id, req.user.id], (err, item) => {
    if (err) return next(err);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    db.run('DELETE FROM items WHERE id = ? AND userId = ?', [req.params.id, req.user.id], function(err) {
      if (err) return next(err);
      res.json(item);
    });
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CRUD API server is running on port ${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;