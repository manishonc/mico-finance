import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "../db";
import * as authSchema from "../db/schemas/auth-schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: authSchema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [ 
        openAPI(), 
    ] 
});