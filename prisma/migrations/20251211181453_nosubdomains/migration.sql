/*
  Warnings:

  - You are about to drop the column `subdomain` on the `Tenant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Tenant_subdomain_key";

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "subdomain";
