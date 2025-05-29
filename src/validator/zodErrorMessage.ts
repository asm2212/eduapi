export enum ZodErrorMessages {
    NAME_MIN = 'Full Name must be at least 3 characters',
    EMAIL_INVALID = 'Invalid email format',
    PHONE_MIN = 'Phone number must be at least 10 digits',
    PHONE_MAX = 'Phone number cannot exceed 15 digits',
    PASSWORD_MIN = 'Password must be at least 6 characters',
    PASSWORD_REQUIRED = 'Password is required',
    PASSWORD_COMPLEXITY = 'Password must contain at least one uppercase, one lowercase, one number, and one special character',
    USERNAME_MIN = 'Username must be at 3 characters',
    USERNAME_MAX = 'Username cannot exceed 15 characters',
    DESCRIPTION_MAX = 'Description cannot exceed 100 characters',
    WEBSITE_INVALID = 'Invalid URL'
}
