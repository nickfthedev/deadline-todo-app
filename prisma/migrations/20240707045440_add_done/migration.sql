/*
  Warnings:

  - You are about to drop the column `time` on the `Timer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Timer" DROP COLUMN "time",
ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false;
