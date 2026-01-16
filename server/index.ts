import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getTransactions, getTransactionWithTotalAmount, updateTransaction, createTransaction, getTransactionsByDateRange, getTransactionsByCategory, getTransactionSummary } from './db/queries'

const app = new Hono()

app.use('/*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Transactions
app.get('/api/transactions', async (c) => {
  const transactions = await getTransactions();
  const totalAmount = await getTransactionWithTotalAmount();
  return c.json({ transactions, totalAmount });
})

app.post('/api/transactions', async (c) => {
  const body = await c.req.json();
  // Convert date string to Date object for Drizzle ORM
  if (typeof body.date === 'string') {
    body.date = new Date(body.date);
  }
  await createTransaction(body);
  return c.json({ success: true });
})

// Query transactions with filters
app.post('/api/transactions/query', async (c) => {
  const body = await c.req.json();
  const { startDate, endDate, category } = body;

  let start: Date | undefined;
  let end: Date | undefined;

  if (startDate) {
    start = new Date(startDate);
  }
  if (endDate) {
    end = new Date(endDate);
  }

  const summary = await getTransactionSummary(start, end, category);
  return c.json({ summary: summary[0] || { totalAmount: null, count: 0 } });
})

app.put('/api/transactions/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const updates = { ...body };
  if (typeof updates.date === 'string') {
    updates.date = new Date(updates.date);
  }
  await updateTransaction({ id, ...updates });
  return c.json({ success: true });
})

export type AppType = typeof app

export default app
