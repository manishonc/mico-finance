import { desc, eq } from "drizzle-orm";
import { db } from ".";
import { entityTable } from "./schema";

export const createEntity = async (entity: typeof entityTable.$inferInsert) => {
  return await db.insert(entityTable).values(entity);
};

export const readEntity = async () => {
  return await db.select().from(entityTable).orderBy(desc(entityTable.type));
};

export const readEntityById = async (id: string) => {
  return await db.select().from(entityTable).where(eq(entityTable.id, id));
};

export const updateEntity = async (id: string, updates: Partial<typeof entityTable.$inferInsert>) => {
  return await db.update(entityTable).set(updates).where(eq(entityTable.id, id));
};

export const deleteEntity = async (id: string) => {
  return await db.delete(entityTable).where(eq(entityTable.id, id));
};
