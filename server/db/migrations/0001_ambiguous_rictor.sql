CREATE TABLE "entity_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entity_type" ADD CONSTRAINT "entity_type_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
-- Create entityType records for each unique type per user
INSERT INTO "entity_type" ("user_id", "name")
SELECT DISTINCT "user_id", "type" FROM "entity"
WHERE "type" IS NOT NULL AND "type" != '';
--> statement-breakpoint
-- Add temporary column for new UUID values
ALTER TABLE "entity" ADD COLUMN "type_id" uuid;
--> statement-breakpoint
-- Update the temporary column with entityType IDs
UPDATE "entity" e
SET "type_id" = (
  SELECT et."id"
  FROM "entity_type" et
  WHERE et."user_id" = e."user_id" AND et."name" = e."type"
);
--> statement-breakpoint
-- Drop the old type column and rename the new one
ALTER TABLE "entity" DROP COLUMN "type";
--> statement-breakpoint
ALTER TABLE "entity" RENAME COLUMN "type_id" TO "type";
--> statement-breakpoint
-- Add the foreign key constraint
ALTER TABLE "entity" ALTER COLUMN "type" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "entity" ADD CONSTRAINT "entity_type_entity_type_id_fk" FOREIGN KEY ("type") REFERENCES "public"."entity_type"("id") ON DELETE restrict ON UPDATE no action;