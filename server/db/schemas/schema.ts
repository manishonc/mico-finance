import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const entityTypeTable = pgTable("entity_type", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
});

export const entityTable = pgTable("entity", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }), // User who owns the entity
  type: uuid("type").notNull().references(() => entityTypeTable.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
});
