ALTER TABLE
  "refresh_tokens" RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE
  "refresh_tokens" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE
  "todos" RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE
  "todos" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE
  "users" RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE
  "users" RENAME COLUMN "updatedAt" TO "updated_at";