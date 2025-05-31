import { z } from 'zod';
import { zodSchemas } from './zodCommon';

export const adminSignupSchema = z.object({
    fullName: zodSchemas.nameSchema,
    email: zodSchemas.emailSchema,
    phone: zodSchemas.phoneSchema,
    password: zodSchemas.passwordSchema
});

export const adminLoginSchema = z.object({
    email: zodSchemas.emailSchema,
    password: z.string()
});

export const adminUpdateSchema = z.object({
    fullName: zodSchemas.nameSchema.optional(),
    phone: zodSchemas.phoneSchema.optional(),
    address: zodSchemas.addressSchema.optional()
});

export const adminChangePasswordSchema = z.object({
    oldPassword: z.string(),
    newPassword: zodSchemas.passwordSchema
});

export const adminChangeStatus = z.object({
    status: zodSchemas.status
});

export const adminChangeCompanyPlan = z.object({
    plan: zodSchemas.plan.optional(),
    maxEmployees: zodSchemas.maxEmployees.optional()
});

