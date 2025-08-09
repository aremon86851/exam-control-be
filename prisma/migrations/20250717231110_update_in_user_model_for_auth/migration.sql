-- CreateEnum
CREATE TYPE "Status" AS ENUM ('INVITED', 'USER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'INVITED';
