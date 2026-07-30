CREATE TYPE "public"."CommentEntityType" AS ENUM('PROJECT_IDEA', 'PROJECT');--> statement-breakpoint
CREATE TABLE "Comment" (
	"id" text PRIMARY KEY NOT NULL,
	"entityType" "CommentEntityType" NOT NULL,
	"entityId" text NOT NULL,
	"userId" text NOT NULL,
	"parentId" text,
	"body" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"isEdited" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ProjectIdea" ADD COLUMN "commentCount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_Comment_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."Comment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_comment_entityType_entityId_createdAt" ON "Comment" USING btree ("entityType","entityId","createdAt");--> statement-breakpoint
CREATE INDEX "idx_comment_parentId" ON "Comment" USING btree ("parentId");--> statement-breakpoint
CREATE INDEX "idx_comment_userId" ON "Comment" USING btree ("userId");