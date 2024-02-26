-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('IN', 'OUT');

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "quantityChanged" INTEGER NOT NULL,
    "lastQuantity" INTEGER NOT NULL,
    "newQuantity" INTEGER NOT NULL,
    "inventoryId" TEXT NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_sku_key" ON "Inventory"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_productId_key" ON "Inventory"("productId");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
