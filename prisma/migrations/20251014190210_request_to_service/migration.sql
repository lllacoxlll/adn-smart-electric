/*
  Warnings:

  - You are about to drop the column `requestDetails` on the `servicerequest` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `servicerequest` table. All the data in the column will be lost.
  - Added the required column `addressLine1` to the `servicerequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `servicerequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceDetails` to the `servicerequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "servicerequest" DROP COLUMN "requestDetails",
DROP COLUMN "street",
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "serviceDetails" TEXT NOT NULL,
ALTER COLUMN "agreementDate" DROP DEFAULT,
ALTER COLUMN "agreementDate" SET DATA TYPE DATE,
ALTER COLUMN "completionDate" SET DATA TYPE DATE;
