-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'INDIVIDUAL', 'COMPANY', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('INDIVIDUAL', 'ADMIN', 'COMPANY', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "Departments" AS ENUM ('Administrative', 'HR', 'Operations_Delivery', 'Product_Service_Development', 'Purchasing', 'Sales', 'Marketing', 'Accounting', 'Finance', 'IT', 'Legal', 'Research_and_Development', 'Customer_Service', 'Training', 'Quality_Assurance', 'Manufacturing', 'Engineering', 'Logistics', 'Facilities', 'Security', 'Project_Management', 'Public_Relations_Communications', 'Investor_Relations', 'Compliance');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "password" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL DEFAULT 'ADMIN',
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "forgetPasswordToken" TEXT,
    "lastLogin" TIMESTAMP(3),
    "userAgent" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "companyContact" TEXT NOT NULL,
    "industry" TEXT,
    "address" JSONB,
    "country" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "socialLinks" JSONB,
    "password" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL DEFAULT 'COMPANY',
    "role" "Role" NOT NULL DEFAULT 'COMPANY',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "companyLogo" TEXT,
    "description" TEXT,
    "website" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "forgetPasswordToken" TEXT,
    "lastLogin" TIMESTAMP(3),
    "userAgent" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactPersonId" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyContact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "department" "Departments",
    "empId" TEXT,
    "jobTitle" TEXT,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT,

    CONSTRAINT "CompanyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "empName" TEXT NOT NULL,
    "empId" TEXT,
    "empEmail" TEXT NOT NULL,
    "department" "Departments",
    "dateOfBirth" TIMESTAMP(3),
    "address" JSONB,
    "country" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "jobTitle" TEXT,
    "profilePicture" TEXT,
    "bio" TEXT,
    "empPhone" TEXT NOT NULL,
    "socialLinks" JSONB,
    "password" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL DEFAULT 'EMPLOYEE',
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "forgetPasswordToken" TEXT,
    "lastLogin" TIMESTAMP(3),
    "userAgent" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Individual" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "socialLinks" JSONB,
    "department" "Departments",
    "dateOfBirth" TIMESTAMP(3),
    "address" JSONB,
    "profilePicture" TEXT,
    "bio" TEXT,
    "gender" TEXT,
    "country" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "password" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL DEFAULT 'INDIVIDUAL',
    "role" "Role" NOT NULL DEFAULT 'INDIVIDUAL',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "forgetPasswordToken" TEXT,
    "lastLogin" TIMESTAMP(3),
    "userAgent" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Individual_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyEmail_key" ON "Company"("companyEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Company_contactPersonId_key" ON "Company"("contactPersonId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyContact_email_key" ON "CompanyContact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyContact_companyId_key" ON "CompanyContact"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_empId_key" ON "Employee"("empId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_empEmail_key" ON "Employee"("empEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Individual_email_key" ON "Individual"("email");

-- AddForeignKey
ALTER TABLE "CompanyContact" ADD CONSTRAINT "CompanyContact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
