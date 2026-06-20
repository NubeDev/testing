const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const todos = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' });
  }
  const todo = { id: todos.length + 1, title };
  todos.push(todo);
  res.status(201).json(todo);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
