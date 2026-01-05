/*
  Warnings:

  - You are about to drop the column `customerSignature` on the `servicerequest` table. All the data in the column will be lost.
  - You are about to drop the column `employeeSignature` on the `servicerequest` table. All the data in the column will be lost.
  - You are about to drop the column `isSigned` on the `servicerequest` table. All the data in the column will be lost.
  - You are about to drop the column `pdfUrl` on the `servicerequest` table. All the data in the column will be lost.
  - You are about to drop the `invoice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `balanceDue` to the `servicerequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedCost` to the `servicerequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('CONTRACT_PDF', 'INVOICE_PDF', 'IMAGE', 'EMPLOYEE_SIG', 'CUSTOMER_SIG');

-- DropForeignKey
ALTER TABLE "public"."invoice" DROP CONSTRAINT "invoice_serviceRequestId_fkey";

-- AlterTable
ALTER TABLE "servicerequest" DROP COLUMN "customerSignature",
DROP COLUMN "employeeSignature",
DROP COLUMN "isSigned",
DROP COLUMN "pdfUrl",
ADD COLUMN     "balanceDue" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "deposit" DECIMAL(10,2),
ADD COLUMN     "estimatedCost" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "hasClientSig" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasTechSig" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentStatus" "Status" NOT NULL DEFAULT 'NOT_PAID';

-- DropTable
DROP TABLE "public"."invoice";

-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL,
    "serviceRequestId" INTEGER NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "servicerequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
