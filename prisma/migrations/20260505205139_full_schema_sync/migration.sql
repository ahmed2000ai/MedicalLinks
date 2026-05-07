-- CreateEnum
CREATE TYPE "HospitalStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('VISIBLE', 'HIDDEN', 'ANONYMOUS');

-- CreateEnum
CREATE TYPE "OpenToOpportunities" AS ENUM ('ACTIVE', 'SELECTIVE', 'PAUSED');

-- CreateEnum
CREATE TYPE "ShortlistStage" AS ENUM ('SAVED', 'REVIEWING', 'INTERVIEW_INVITED', 'INTERVIEW_COMPLETED', 'OFFER_CONSIDERATION', 'HIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InterviewInvitationStatus" AS ENUM ('INVITED', 'ACCEPTED', 'DECLINED', 'RESCHEDULE_REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "ApplicantPreference" ADD COLUMN     "hideContactDetails" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "hideCurrentEmployer" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "openToOpportunities" "OpenToOpportunities" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "visibility" "ProfileVisibility" NOT NULL DEFAULT 'VISIBLE';

-- AlterTable
ALTER TABLE "HospitalOrganization" ADD COLUMN     "agreementEndDate" TIMESTAMP(3),
ADD COLUMN     "agreementNotes" TEXT,
ADD COLUMN     "agreementStartDate" TIMESTAMP(3),
ADD COLUMN     "commissionRate" DOUBLE PRECISION,
ADD COLUMN     "status" "HospitalStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "SavedCandidate" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "applicantProfileId" TEXT NOT NULL,
    "stage" "ShortlistStage" NOT NULL DEFAULT 'SAVED',
    "notes" TEXT,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewInvitation" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "initiatedByUserId" TEXT NOT NULL,
    "applicantProfileId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "title" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'GST',
    "type" "InterviewType" NOT NULL DEFAULT 'VIRTUAL',
    "location" TEXT,
    "meetingLink" TEXT,
    "notes" TEXT,
    "status" "InterviewInvitationStatus" NOT NULL DEFAULT 'INVITED',
    "doctorResponseNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "subject" TEXT,
    "applicationId" TEXT,
    "opportunityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hasUnread" BOOLEAN NOT NULL DEFAULT false,
    "lastReadAt" TIMESTAMP(3),
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "linkUrl" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedCandidate_hospitalId_applicantProfileId_key" ON "SavedCandidate"("hospitalId", "applicantProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");

-- AddForeignKey
ALTER TABLE "SavedCandidate" ADD CONSTRAINT "SavedCandidate_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "HospitalOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCandidate" ADD CONSTRAINT "SavedCandidate_applicantProfileId_fkey" FOREIGN KEY ("applicantProfileId") REFERENCES "ApplicantProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewInvitation" ADD CONSTRAINT "InterviewInvitation_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "HospitalOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewInvitation" ADD CONSTRAINT "InterviewInvitation_initiatedByUserId_fkey" FOREIGN KEY ("initiatedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewInvitation" ADD CONSTRAINT "InterviewInvitation_applicantProfileId_fkey" FOREIGN KEY ("applicantProfileId") REFERENCES "ApplicantProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewInvitation" ADD CONSTRAINT "InterviewInvitation_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
