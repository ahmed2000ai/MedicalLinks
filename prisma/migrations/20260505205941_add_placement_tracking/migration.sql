-- CreateEnum
CREATE TYPE "PlacementStatus" AS ENUM ('DRAFT', 'REPORTED', 'CONFIRMED', 'DISPUTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PlacementSource" AS ENUM ('OPPORTUNITY_BASED', 'DIRECT_DISCOVERY', 'SHORTLIST_BASED', 'INTERVIEW_BASED');

-- CreateTable
CREATE TABLE "Placement" (
    "id" TEXT NOT NULL,
    "applicantProfileId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "recordedByUserId" TEXT,
    "opportunityId" TEXT,
    "interviewInvitationId" TEXT,
    "source" "PlacementSource" NOT NULL DEFAULT 'DIRECT_DISCOVERY',
    "hireDate" TIMESTAMP(3) NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "monthlySalary" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "feeAmount" DOUBLE PRECISION NOT NULL,
    "status" "PlacementStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "confirmedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Placement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Placement_interviewInvitationId_key" ON "Placement"("interviewInvitationId");

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_applicantProfileId_fkey" FOREIGN KEY ("applicantProfileId") REFERENCES "ApplicantProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "HospitalOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_recordedByUserId_fkey" FOREIGN KEY ("recordedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_interviewInvitationId_fkey" FOREIGN KEY ("interviewInvitationId") REFERENCES "InterviewInvitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
