import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const entityTable = pgTable("entity", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  name: text("name").notNull(),
});
