import { Column } from "drizzle-orm";
import { db } from "../server/db";
import  * as schema from "../server/db/schema";
import { seed } from "drizzle-seed";

const seedLocalDb = async () => {
  await seed(db, schema).refine((funcs) => ({
    transactionsTable: {
        columns: {
            description: funcs.valuesFromArray({ values: ["Buy groceries", "Buy clothes", "Buy shoes"] }),
            amount: funcs.valuesFromArray({ values: [100, 200, 300] }),
            category: funcs.valuesFromArray({ values: ["Food", "Clothing", "Shoes"] }),
            status: funcs.valuesFromArray({ values: ["Completed", "Pending", "Failed"] }),
        },
    }
  }));
};

seedLocalDb().then(() => {
  console.log("Local database seeded successfully");
  return;
}).catch((error) => {
  console.error("Error seeding local database", error);
  return;
});