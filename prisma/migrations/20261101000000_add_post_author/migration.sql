ALTER TABLE "Post"
RENAME COLUMN "userId" TO "authorId";

ALTER TABLE "Post"
DROP CONSTRAINT "Post_userId_fkey";

ALTER TABLE "Post"
ADD CONSTRAINT "Post_authorId_fkey"
FOREIGN KEY ("authorId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");