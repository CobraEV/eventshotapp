/*
  Warnings:

  - Made the column `thumbUrl` on table `Photo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Photo" ALTER COLUMN "thumbUrl" SET NOT NULL;
