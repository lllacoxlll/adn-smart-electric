/*
  Warnings:

  - You are about to drop the column `firstName` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `serviceCharge` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `serviceDescription` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `servicerequest` table. All the data in the column will be lost.
  - Added the required column `name` to the `customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balanceDue` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedCost` to the `invoice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('RESIDENTIAL', 'COMMERCIAL');

-- AlterTable
ALTER TABLE "public"."customer" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."invoice" DROP COLUMN "serviceCharge",
DROP COLUMN "serviceDescription",
ADD COLUMN     "balanceDue" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "deposit" DECIMAL(10,2),
ADD COLUMN     "estimatedCost" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "public"."servicerequest" DROP COLUMN "signature",
ADD COLUMN     "agreementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "completionDate" TIMESTAMP(3),
ADD COLUMN     "customerSignature" TEXT,
ADD COLUMN     "employeeSignature" TEXT,
ADD COLUMN     "propertyType" "public"."PropertyType" NOT NULL DEFAULT 'RESIDENTIAL';
