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
