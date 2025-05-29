import { z } from 'zod';
import { zodSchemas } from './zodCommon';

export const companySignupSchema = z.object({
    fullName: zodSchemas.nameSchema,
    email: zodSchemas.emailSchema,
    phone: zodSchemas.phoneSchema,
    password: zodSchemas.passwordSchema
});

export const companyLoginSchema = z.object({
    email: zodSchemas.emailSchema,
    password: z.string()
});

export const companyUpdateSchema = z.object({
    fullName: zodSchemas.nameSchema.optional(),
    phone: zodSchemas.phoneSchema.optional(),
    address: zodSchemas.addressSchema.optional(),
    socialLinks: zodSchemas.socialLinks.optional(),
    website: zodSchemas.website.optional(),
    description: zodSchemas.description.optional(),
    username: zodSchemas.username.optional(),
    industry: zodSchemas.industry.optional()
});

export const companyChangePasswordSchema = z.object({
    oldPassword: z.string(),
    newPassword: zodSchemas.passwordSchema
});
