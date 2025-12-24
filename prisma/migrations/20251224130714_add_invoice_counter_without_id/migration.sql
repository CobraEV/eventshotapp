/*
  Warnings:

  - The primary key for the `InvoiceCounter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `InvoiceCounter` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "InvoiceCounter_key_key";

-- AlterTable
ALTER TABLE "InvoiceCounter" DROP CONSTRAINT "InvoiceCounter_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "InvoiceCounter_pkey" PRIMARY KEY ("key");
