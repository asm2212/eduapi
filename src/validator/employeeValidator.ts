import { z } from 'zod';
import { zodSchemas } from './zodCommon';

export const employeeSignupSchema = z.object({
    fullName: zodSchemas.nameSchema,
    email: zodSchemas.emailSchema,
    empId: zodSchemas.empId.optional(),
    phone: zodSchemas.phoneSchema.optional(),
    password: zodSchemas.passwordSchema,
    department: zodSchemas.department.optional(),
    dateOfBirth: zodSchemas.dateOfBirth.optional(),
    gender: zodSchemas.gender.optional(),
    jobTitle: zodSchemas.jobTitle.optional(),
    status: zodSchemas.status.optional()
});

export const employeeLoginSchema = z.object({
    email: zodSchemas.emailSchema,
    password: z.string()
});

export const employeeUpdateSchema = z.object({
    fullName: zodSchemas.nameSchema.optional(),
    department: zodSchemas.department.optional(),
    dateOfBirth: zodSchemas.dateOfBirth.optional(),
    address: zodSchemas.addressSchema.optional(),
    gender: zodSchemas.gender.optional(),
    jobTitle: zodSchemas.jobTitle.optional(),
    description: zodSchemas.description.optional(),
    phone: zodSchemas.phoneSchema.optional(),
    socialLinks: zodSchemas.socialLinks.optional()
});
