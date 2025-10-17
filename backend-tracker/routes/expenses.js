const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();


let expenses = [
  { id: uuidv4(), title: 'Groceries', amount: 45.5, date: '2025-10-01', category: 'Food' },
  { id: uuidv4(), title: 'Bus pass', amount: 10, date: '2025-10-02', category: 'Transport' }
];

router.get('/', (req, res) => {
  res.json(expenses);
});

router.get('/:id', (req, res) => {
  const e = expenses.find(x => x.id === req.params.id);
  if (!e) return res.status(404).json({ error: 'Expense not found' });
  res.json(e);
});

// CREATE
router.post('/', (req, res) => {
  const { title, amount, date, category } = req.body;

  // basic validation
  if (!title || typeof title !== 'string') return res.status(400).json({ error: 'Title is required' });
  if (isNaN(Number(amount))) return res.status(400).json({ error: 'Amount must be a number' });
  if (!date || isNaN(Date.parse(date))) return res.status(400).json({ error: 'Valid date is required' });
  if (!category || typeof category !== 'string') return res.status(400).json({ error: 'Category is required' });

  const newExpense = { id: uuidv4(), title, amount: Number(amount), date, category };
  expenses.unshift(newExpense); 
  res.status(201).json(newExpense);
});

router.put('/:id', (req, res) => {
  const idx = expenses.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Expense not found' });

  const { title, amount, date, category } = req.body;
  if (!title || typeof title !== 'string') return res.status(400).json({ error: 'Title is required' });
  if (isNaN(Number(amount))) return res.status(400).json({ error: 'Amount must be a number' });
  if (!date || isNaN(Date.parse(date))) return res.status(400).json({ error: 'Valid date is required' });
  if (!category || typeof category !== 'string') return res.status(400).json({ error: 'Category is required' });

  const updated = { ...expenses[idx], title, amount: Number(amount), date, category };
  expenses[idx] = updated;
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const beforeLen = expenses.length;
  expenses = expenses.filter(x => x.id !== req.params.id);
  if (expenses.length === beforeLen) return res.status(404).json({ error: 'Expense not found' });
  res.status(204).send();
});

module.exports = router;
