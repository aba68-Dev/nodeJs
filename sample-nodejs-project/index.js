const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// In-memory storage for items
let items = [];
let nextId = 1;

// CREATE
app.post('/items', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newItem = { id: nextId++, name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// READ ALL
app.get('/items', (req, res) => {
  res.json(items);
});

// READ ONE
app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

// UPDATE
app.put('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  item.name = name;
  res.json(item);
});

// DELETE
app.delete('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  const deleted = items.splice(index, 1);
  res.json(deleted[0]);
});

app.listen(PORT, () => {
  console.log(`CRUD API server is running on port ${PORT}`);
});