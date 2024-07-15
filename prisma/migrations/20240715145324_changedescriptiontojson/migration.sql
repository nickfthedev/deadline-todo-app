/*
  Warnings:

  - The `description` column on the `Timer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Timer" DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL DEFAULT '{}';
