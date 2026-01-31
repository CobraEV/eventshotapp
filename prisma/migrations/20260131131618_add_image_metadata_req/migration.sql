/*
  Warnings:

  - Made the column `height` on table `Photo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `width` on table `Photo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Photo" ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "width" SET NOT NULL;
