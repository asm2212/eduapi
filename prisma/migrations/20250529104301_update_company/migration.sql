-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('TRIAL', 'BASIC', 'STANDARD', 'PREMIUM');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "maxEmployees" TEXT,
ADD COLUMN     "plan" "PlanType" NOT NULL DEFAULT 'TRIAL';
