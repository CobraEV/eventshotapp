/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `token` on the `Event` table. All the data in the column will be lost.
  - The primary key for the `Photo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[publicCode]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - The required column `publicCode` was added to the `Event` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_eventId_fkey";

-- DropIndex
DROP INDEX "Event_tenantId_name_key";

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "token",
ADD COLUMN     "pin" TEXT,
ADD COLUMN     "publicCode" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Event_id_seq";

-- AlterTable
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "eventId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Photo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Photo_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Event_publicCode_key" ON "Event"("publicCode");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
