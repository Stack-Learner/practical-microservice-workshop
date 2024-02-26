/*
  Warnings:

  - Added the required column `updatedAt` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_inventoryId_fkey";

-- AlterTable
ALTER TABLE "History" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
