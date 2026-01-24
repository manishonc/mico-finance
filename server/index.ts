import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createEntity, readEntity, readEntityById, updateEntity, deleteEntity, readEntityByUser, createEntityType, readEntityTypeByUser, readEntityTypeById, updateEntityType, deleteEntityType } from './db/queries'
import { auth } from './lib/auth';
import { authMiddleware } from './middleware/aut.middleware';
import { HonoEnv } from './types';


const app = new Hono<HonoEnv>()

app.use(
  '/api/*',
  cors({
    origin: ['http://localhost:5000', 'http://localhost:3000'],
    credentials: true,
  })
)

// Auth endpoints - better-auth handles its own CORS
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));


// Root endpoint
app.get('/', (c) => {
  return c.text('Welcome to the Mico Finance API')
})

// Entity CRUD endpoints - protected routes
app.use('/api/entities/*', authMiddleware);

app.get('/api/entities', async (c) => {
  const entities = await readEntityByUser(c.get("user").id);
  return c.json({ entities });
})

app.get('/api/entities/:id', async (c) => {
  const id = c.req.param('id');
  const entity = await readEntityByUser(c.get("user").id);
  const filtered = entity.filter(e => e.id === id);
  return c.json({ entity: filtered[0] || null });
})

app.post('/api/entities', async (c) => {
  const body = await c.req.json();
  await createEntity({ ...body, userId: c.get("user").id });
  return c.json({ success: true });
})

app.put('/api/entities/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  await updateEntity(id, { ...body, userId: c.get("user").id });
  return c.json({ success: true });
})

app.delete('/api/entities/:id', async (c) => {
  const id = c.req.param('id');
  await deleteEntity(id, c.get("user").id);
  return c.json({ success: true });
})




// read entity by user
app.get('/api/entities/user', async (c) => {
  const entities = await readEntityByUser(c.get("user").id);
  return c.json({ entities });
});

// EntityType CRUD endpoints - protected routes
app.use('/api/entity-types/*', authMiddleware);

app.get('/api/entity-types', async (c) => {
  const entityTypes = await readEntityTypeByUser(c.get("user").id);
  return c.json({ entityTypes });
})

app.get('/api/entity-types/:id', async (c) => {
  const id = c.req.param('id');
  const entityType = await readEntityTypeByUser(c.get("user").id);
  const filtered = entityType.filter(et => et.id === id);
  return c.json({ entityType: filtered[0] || null });
})

app.post('/api/entity-types', async (c) => {
  const body = await c.req.json();
  await createEntityType({ ...body, userId: c.get("user").id });
  return c.json({ success: true });
})

app.put('/api/entity-types/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  await updateEntityType(id, { ...body, userId: c.get("user").id });
  return c.json({ success: true });
})

app.delete('/api/entity-types/:id', async (c) => {
  const id = c.req.param('id');
  try {
    await deleteEntityType(id, c.get("user").id);
    return c.json({ success: true });
  } catch (error: any) {
    if (error.code === '23503') { // PostgreSQL FK violation
      return c.json({
        success: false,
        error: "Cannot delete entity type that is in use by entities"
      }, 400);
    }
    throw error;
  }
})

export type AppType = typeof app;

export default app;
