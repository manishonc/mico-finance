import { eq, sum } from "drizzle-orm";
import { db } from ".";
import { transactionsTable } from "./schema";

export const getTransactions = async () => {
    return await db.select().from(transactionsTable);
};

export const createTransaction = async (transaction: typeof transactionsTable.$inferInsert) => {
    return await db.insert(transactionsTable).values(transaction);
};

type UpdateTransactionInput = Partial<typeof transactionsTable.$inferInsert> & { id: string };

export const updateTransaction = async (transaction: UpdateTransactionInput) => {
    const { id, ...updates } = transaction;
    if (updates.date && typeof updates.date === "string") {
        updates.date = new Date(updates.date);
    }
    return await db.update(transactionsTable).set(updates).where(eq(transactionsTable.id, id));
};

export const deleteTransaction = async (id: string) => {
    return await db.delete(transactionsTable).where(eq(transactionsTable.id, id));
};  


// get transaction with the total amount of the transaction
export const getTransactionWithTotalAmount = async () => {
    return await db.select({
        totalAmount: sum(transactionsTable.amount)
    }).from(transactionsTable);
};