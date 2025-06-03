import { z } from 'zod';
import { zodSchemas } from './zodCommon';

export const individualSignupSchema = z.object({
    fullName: zodSchemas.nameSchema,
    email: zodSchemas.emailSchema,
    phone: zodSchemas.phoneSchema.optional(),
    password: zodSchemas.passwordSchema
});

export const individualLoginSchema = z.object({
    email: zodSchemas.emailSchema,
    password: z.string()
});

export const individualUpdateSchema = z.object({
    fullName: zodSchemas.nameSchema.optional(),
    phone: zodSchemas.phoneSchema.optional(),
    jobTitle: zodSchemas.jobTitle.optional(),
    company: zodSchemas.company.optional(),
    insitute: zodSchemas.institute.optional(),
    course: zodSchemas.course.optional(),
    gender: zodSchemas.gender.optional(),
    dateOfBirth: zodSchemas.dateOfBirth.optional(),
    department: zodSchemas.department.optional(),
    address: zodSchemas.addressSchema.optional(),
    socialLinks: zodSchemas.socialLinks.optional(),
    description: zodSchemas.description.optional(),
    username: zodSchemas.username.optional(),
    industry: zodSchemas.industry.optional()
});

export const individualChangePasswordSchema = z.object({
    oldPassword: z.string(),

    newPassword: zodSchemas.passwordSchema
});
