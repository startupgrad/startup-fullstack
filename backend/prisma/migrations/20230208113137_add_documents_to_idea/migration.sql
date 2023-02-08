-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "documents" TEXT[] DEFAULT ARRAY[]::TEXT[];
