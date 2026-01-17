import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const entityTable = pgTable("entity", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }), // User who owns the entity
  type: text("type").notNull(),
  name: text("name").notNull(),
});
