/*
  Warnings:

  - Added the required column `employeeId` to the `servicerequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "servicerequest" ADD COLUMN     "employeeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "servicerequest" ADD CONSTRAINT "servicerequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
