/*
  Warnings:

  - A unique constraint covering the columns `[serviceRequestToken]` on the table `servicerequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "servicerequest_serviceRequestToken_key" ON "servicerequest"("serviceRequestToken");
