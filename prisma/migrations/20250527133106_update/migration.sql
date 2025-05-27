-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "companyContact" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "empPhone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Individual" ALTER COLUMN "phone" DROP NOT NULL;
