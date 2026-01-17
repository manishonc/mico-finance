CREATE TABLE "entity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL, -- entity type: person, organization, account, etc.
	"name" text NOT NULL -- entity name: John Doe, Acme Inc, etc.
);
