/*
  Warnings:

  - You are about to drop the column `city` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `companyContact` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `companyEmail` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `CompanyContact` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `empEmail` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `empName` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `empPhone` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `Individual` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Individual` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Individual` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Individual` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullname` to the `CompanyContact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Company_companyEmail_key";

-- DropIndex
DROP INDEX "Employee_empEmail_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "city",
DROP COLUMN "companyContact",
DROP COLUMN "companyEmail",
DROP COLUMN "companyName",
DROP COLUMN "country",
DROP COLUMN "postalCode",
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "username" TEXT;

-- AlterTable
ALTER TABLE "CompanyContact" DROP COLUMN "name",
ADD COLUMN     "fullname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "bio",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "empEmail",
DROP COLUMN "empName",
DROP COLUMN "empPhone",
DROP COLUMN "postalCode",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Individual" DROP COLUMN "bio",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "postalCode",
ADD COLUMN     "company" TEXT,
ADD COLUMN     "course" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "institute" TEXT,
ADD COLUMN     "jobTitle" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
