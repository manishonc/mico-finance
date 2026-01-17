import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createEntity, readEntity, readEntityById, updateEntity, deleteEntity } from './db/queries'
import { auth } from './lib/auth';

const app = new Hono()

// Auth endpoints
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// CORS middleware
app.use('/*', cors())

// Root endpoint
app.get('/', (c) => {
  return c.text('Welcome to the Mico Finance API')
})

// Entity CRUD endpoints
app.get('/api/entities', async (c) => {
  const entities = await readEntity();
  return c.json({ entities });
})

app.get('/api/entities/:id', async (c) => {
  const id = c.req.param('id');
  const entity = await readEntityById(id);
  return c.json({ entity: entity[0] || null });
})

app.post('/api/entities', async (c) => {
  const body = await c.req.json();
  await createEntity(body);
  return c.json({ success: true });
})

app.put('/api/entities/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  await updateEntity(id, body);
  return c.json({ success: true });
})

app.delete('/api/entities/:id', async (c) => {
  const id = c.req.param('id');
  await deleteEntity(id);
  return c.json({ success: true });
})

export type AppType = typeof app

export default app
