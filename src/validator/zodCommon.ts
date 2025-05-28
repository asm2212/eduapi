import { z } from 'zod';

export enum ZodErrorMessages {
    NAME_MIN = 'Full Name must be at least 3 characters',
    EMAIL_INVALID = 'Invalid email format',
    PHONE_MIN = 'Phone number must be at least 10 digits',
    PHONE_MAX = 'Phone number cannot exceed 15 digits',
    PASSWORD_MIN = 'Password must be at least 6 characters',
    PASSWORD_REQUIRED = 'Password is required',
    PASSWORD_COMPLEXITY = 'Password must contain at least one uppercase, one lowercase, one number, and one special character'
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
    })
};

