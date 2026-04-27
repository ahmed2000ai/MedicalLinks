-- AlterTable
ALTER TABLE "HospitalOrganization" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "annualFlights" INTEGER,
ADD COLUMN     "benefitsNotes" TEXT,
ADD COLUMN     "boardCertRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "healthInsurance" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "housingAllowance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "leaveAllowanceDays" INTEGER,
ADD COLUMN     "minYearsPostSpecialty" INTEGER,
ADD COLUMN     "seniority" TEXT,
ADD COLUMN     "targetStartDate" TIMESTAMP(3),
ADD COLUMN     "urgency" TEXT DEFAULT 'STANDARD';
