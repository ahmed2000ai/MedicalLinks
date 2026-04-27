-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "issueDate" TIMESTAMP(3),
ADD COLUMN     "issuingAuthority" TEXT,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "title" TEXT;
