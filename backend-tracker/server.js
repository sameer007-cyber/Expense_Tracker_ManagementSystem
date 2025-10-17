const express = require('express');
const cors = require('cors');
const expensesRouter = require('./routes/expenses');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/expenses', expensesRouter);

// simple health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
