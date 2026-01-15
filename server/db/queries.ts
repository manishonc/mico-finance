import { eq, sum } from "drizzle-orm";
import { db } from ".";
import { transactionsTable } from "./schema";

export const getTransactions = async () => {
    return await db.select().from(transactionsTable);
};

export const createTransaction = async (transaction: typeof transactionsTable.$inferInsert) => {
    return await db.insert(transactionsTable).values(transaction);
};

export const updateTransaction = async (transaction: typeof transactionsTable.$inferSelect & { id: string }) => {
    return await db.update(transactionsTable).set(transaction).where(eq(transactionsTable.id, transaction.id));
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