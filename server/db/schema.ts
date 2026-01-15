import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const transactionsTable = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").notNull(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull(),
});
