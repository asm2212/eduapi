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

export const adminCreateCompany = z.object({
    fullName: zodSchemas.nameSchema,
    email: zodSchemas.emailSchema,
    phone: zodSchemas.phoneSchema.optional(),
    password: zodSchemas.passwordSchema,
    industry: zodSchemas.industry.optional(),
    username: zodSchemas.username.optional(),
    description: zodSchemas.description.optional(),
    plan: zodSchemas.plan.optional(),
    maxEmployees: zodSchemas.maxEmployees.optional()
});

export const adminChangeStatus = z.object({
    status: zodSchemas.status
});

export const adminChangeCompanyPlan = z.object({
    plan: zodSchemas.plan.optional(),
    maxEmployees: zodSchemas.maxEmployees.optional()
});

export const adminCreateIndividualSchema = z.object({
    fullName: zodSchemas.nameSchema,
    email: zodSchemas.emailSchema,
    phone: zodSchemas.phoneSchema.optional(),
    password: zodSchemas.passwordSchema
});

export const adminIndividualUpdateSchema = z.object({
    email: zodSchemas.emailSchema.optional(),
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
