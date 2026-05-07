-- CreateEnum
CREATE TYPE "CommercialRecordStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'WAIVED', 'DISPUTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "CommercialRecord" (
    "id" TEXT NOT NULL,
    "placementId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "applicantProfileId" TEXT NOT NULL,
    "status" "CommercialRecordStatus" NOT NULL DEFAULT 'DRAFT',
    "monthlySalary" DOUBLE PRECISION NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "feeAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "issueDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "paymentDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommercialRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommercialRecord_placementId_key" ON "CommercialRecord"("placementId");

-- AddForeignKey
ALTER TABLE "CommercialRecord" ADD CONSTRAINT "CommercialRecord_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "Placement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommercialRecord" ADD CONSTRAINT "CommercialRecord_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "HospitalOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommercialRecord" ADD CONSTRAINT "CommercialRecord_applicantProfileId_fkey" FOREIGN KEY ("applicantProfileId") REFERENCES "ApplicantProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
