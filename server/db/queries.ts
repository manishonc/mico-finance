import { eq, sum, desc, sql } from "drizzle-orm";
import { db } from ".";
import { transactionsTable } from "./schema";

export const getTransactions = async () => {
    return await db.select().from(transactionsTable).orderBy(desc(transactionsTable.date));
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

export const getTransactionsByDateRange = async (startDate: Date, endDate: Date) => {
    return await db.select()
        .from(transactionsTable)
        .where(sql`${transactionsTable.date} >= ${startDate} AND ${transactionsTable.date} <= ${endDate}`)
        .orderBy(desc(transactionsTable.date));
};

export const getTransactionsByCategory = async (category: string) => {
    return await db.select()
        .from(transactionsTable)
        .where(eq(transactionsTable.category, category))
        .orderBy(desc(transactionsTable.date));
};

export const getTransactionSummary = async (startDate?: Date, endDate?: Date, category?: string) => {
    let conditions = [];
    if (startDate && endDate) {
        conditions.push(sql`${transactionsTable.date} >= ${startDate} AND ${transactionsTable.date} <= ${endDate}`);
    }
    if (category) {
        conditions.push(eq(transactionsTable.category, category));
    }

    let query = db.select({
        totalAmount: sum(transactionsTable.amount),
        count: sql<number>`count(*)`
    }).from(transactionsTable);

    if (conditions.length > 0) {
        const combinedCondition = conditions.length > 1 
            ? sql`(${sql.join(conditions, sql` AND `)})`
            : conditions[0];
        query = query.where(combinedCondition) as any;
    }

    return await query;
};
