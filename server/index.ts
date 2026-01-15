import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getTransactions, getTransactionWithTotalAmount, updateTransaction } from './db/queries'

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

app.put('/api/transactions/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  await updateTransaction({ id, ...body });
  return c.json({ success: true });
})

export type AppType = typeof app

export default app
