import { z } from 'zod';
import { ZodErrorMessages } from './zodErrorMessage';

enum Departments {
    Administrative = 'Administrative',
    HR = 'HR',
    Operations_Delivery = 'Operations_Delivery',
    Product_Service_Development = 'Product_Service_Development',
    Purchasing = 'Purchasing',
    Sales = 'Sales',
    Marketing = 'Marketing',
    Accounting = 'Accounting',
    Finance = 'Finance',
    IT = 'IT',
    Legal = 'Legal',
    Research_and_Development = 'Research_and_Development',
    Customer_Service = 'Customer_Service',
    Training = 'Training',
    Quality_Assurance = 'Quality_Assurance',
    Manufacturing = 'Manufacturing',
    Engineering = 'Engineering',
    Logistics = 'Logistics',
    Facilities = 'Facilities',
    Security = 'Security',
    Project_Management = 'Project_Management',
    Public_Relations_Communications = 'Public_Relations_Communications',
    Investor_Relations = 'Investor_Relations',
    Compliance = 'Compliance'
}

// Reusable Zod string schemas with common validations
export const zodSchemas = {
    nameSchema: z.string().min(3, ZodErrorMessages.NAME_MIN),
    emailSchema: z.string().email(ZodErrorMessages.EMAIL_INVALID).trim().toLowerCase(),
    phoneSchema: z.string().min(10, ZodErrorMessages.PHONE_MIN).max(15, ZodErrorMessages.PHONE_MAX).trim(),
    passwordSchema: z
        .string()
        .min(6, ZodErrorMessages.PASSWORD_MIN)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, ZodErrorMessages.PASSWORD_COMPLEXITY)
        .nonempty(ZodErrorMessages.PASSWORD_REQUIRED),

    addressSchema: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional()
    }),

    username: z.string().min(3, ZodErrorMessages.USERNAME_MIN).max(25, ZodErrorMessages.USERNAME_MAX),
    industry: z.string(),
    description: z.string().max(100, ZodErrorMessages.DESCRIPTION_MAX),
    website: z.string().url(ZodErrorMessages.WEBSITE_INVALID),

    socialLinks: z.object({
        linkedin: z.string().url(ZodErrorMessages.WEBSITE_INVALID).optional(),
        twitter: z.string().url(ZodErrorMessages.WEBSITE_INVALID).optional(),
        facebook: z.string().url(ZodErrorMessages.WEBSITE_INVALID).optional(),
        instagram: z.string().url(ZodErrorMessages.WEBSITE_INVALID).optional(),
        github: z.string().url(ZodErrorMessages.WEBSITE_INVALID).optional(),
        gitlab: z.string().url(ZodErrorMessages.WEBSITE_INVALID).optional()
    }),
    companyId: z.string(),
    empId: z.string(),
    department: z.nativeEnum(Departments),
    dateOfBirth: z.date(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    jobTitle: z.string(),
    status: z.enum(['ACTIVE', 'BLOCKED', 'INACTIVE'])
};

