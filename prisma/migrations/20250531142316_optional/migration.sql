-- AlterEnum
ALTER TYPE "PlanType" ADD VALUE 'CUSTOM';

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "plan" DROP NOT NULL;
