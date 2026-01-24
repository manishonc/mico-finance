import { and, desc, eq } from "drizzle-orm";
import { db } from ".";
import { entityTable, entityTypeTable } from "./schemas/schema";

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

export const deleteEntity = async (id: string, userId: string) => {
  return await db.delete(entityTable).where(and(eq(entityTable.id, id), eq(entityTable.userId, userId)));
};

export const readEntityByUser = async (userId: string) => {
  return await db
    .select({
      id: entityTable.id,
      userId: entityTable.userId,
      type: entityTable.type,
      typeName: entityTypeTable.name,
      name: entityTable.name,
    })
    .from(entityTable)
    .leftJoin(entityTypeTable, eq(entityTable.type, entityTypeTable.id))
    .where(eq(entityTable.userId, userId));
};

// EntityType CRUD operations
export const createEntityType = async (
  entityType: typeof entityTypeTable.$inferInsert
) => {
  return await db.insert(entityTypeTable).values(entityType);
};

export const readEntityTypeByUser = async (userId: string) => {
  return await db
    .select()
    .from(entityTypeTable)
    .where(eq(entityTypeTable.userId, userId));
};

export const readEntityTypeById = async (id: string) => {
  return await db
    .select()
    .from(entityTypeTable)
    .where(eq(entityTypeTable.id, id));
};

export const updateEntityType = async (
  id: string,
  updates: Partial<typeof entityTypeTable.$inferInsert>
) => {
  return await db
    .update(entityTypeTable)
    .set(updates)
    .where(eq(entityTypeTable.id, id));
};

export const deleteEntityType = async (id: string, userId: string) => {
  return await db
    .delete(entityTypeTable)
    .where(
      and(eq(entityTypeTable.id, id), eq(entityTypeTable.userId, userId))
    );
};