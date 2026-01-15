CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp NOT NULL,
	"description" text NOT NULL,
	"amount" integer NOT NULL,
	"category" text NOT NULL,
	"status" text NOT NULL
);
 