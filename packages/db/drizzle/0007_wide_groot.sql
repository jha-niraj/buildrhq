CREATE TABLE "credit_hold" (
	"id" text PRIMARY KEY NOT NULL,
	"hold_id" text NOT NULL,
	"user_id" text NOT NULL,
	"amount" integer NOT NULL,
	"status" text DEFAULT 'held' NOT NULL,
	"reason" text NOT NULL,
	"release_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "credit_hold_hold_id_unique" UNIQUE("hold_id")
);
--> statement-breakpoint
ALTER TABLE "credit_hold" ADD CONSTRAINT "credit_hold_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "credit_hold_user_id_idx" ON "credit_hold" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "credit_hold_status_idx" ON "credit_hold" USING btree ("status");