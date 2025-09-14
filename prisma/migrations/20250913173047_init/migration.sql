-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PAID', 'NOT_PAID', 'PROCESSING');

-- CreateTable
CREATE TABLE "public"."ServiceRequest" (
    "id" SERIAL NOT NULL,
    "serviceRequestToken" UUID NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "requestDetails" TEXT NOT NULL,
    "signature" TEXT,
    "isSigned" BOOLEAN NOT NULL DEFAULT false,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invoice" (
    "id" SERIAL NOT NULL,
    "serviceDescription" TEXT NOT NULL,
    "paymentStatus" "public"."Status" NOT NULL DEFAULT 'NOT_PAID',
    "serviceCharge" DECIMAL(10,2) NOT NULL,
    "serviceRequestId" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "public"."Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_serviceRequestId_key" ON "public"."Invoice"("serviceRequestId");

-- AddForeignKey
ALTER TABLE "public"."ServiceRequest" ADD CONSTRAINT "ServiceRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "public"."ServiceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
