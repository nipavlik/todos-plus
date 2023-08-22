DROP INDEX "users_nickname_key";

ALTER TABLE "users" RENAME COLUMN "nickname" TO "username";

CREATE UNIQUE INDEX "users_username_key" ON "users"("username");