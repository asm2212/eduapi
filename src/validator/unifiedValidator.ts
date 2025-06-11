import * as z from 'zod';

export const unifiedLoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});
