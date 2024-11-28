-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlogPostReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reporterId" INTEGER NOT NULL,
    "blogPostId" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "reportedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlogPostReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlogPostReport_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BlogPostReport" ("blogPostId", "explanation", "id", "reportedAt", "reporterId") SELECT "blogPostId", "explanation", "id", "reportedAt", "reporterId" FROM "BlogPostReport";
DROP TABLE "BlogPostReport";
ALTER TABLE "new_BlogPostReport" RENAME TO "BlogPostReport";
CREATE INDEX "BlogPostReport_blogPostId_idx" ON "BlogPostReport"("blogPostId");
CREATE TABLE "new_BlogPostVote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "blogPostId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlogPostVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlogPostVote_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BlogPostVote" ("blogPostId", "createdAt", "id", "type", "userId") SELECT "blogPostId", "createdAt", "id", "type", "userId" FROM "BlogPostVote";
DROP TABLE "BlogPostVote";
ALTER TABLE "new_BlogPostVote" RENAME TO "BlogPostVote";
CREATE UNIQUE INDEX "BlogPostVote_userId_blogPostId_key" ON "BlogPostVote"("userId", "blogPostId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
