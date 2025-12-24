-- CreateTable
CREATE TABLE "InvoiceCounter" (
    "id" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "current" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceCounter_key_key" ON "InvoiceCounter"("key");
