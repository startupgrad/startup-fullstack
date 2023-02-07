-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
