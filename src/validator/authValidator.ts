import { z } from 'zod';

/** Schema for validating user signup data. */
export const authSignupSchema = z.object({});

/** Schema for validating user login data. */
export const authLoginSchema = z.object({});

/** Schema for validating forgot password data. */
export const forgotPasswordSchema = z.object({});

/** Schema for validating reset password data. */
export const resetPasswordSchema = z.object({});
