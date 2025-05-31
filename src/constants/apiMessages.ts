const apiMessages = {
    // General Success Messages
    success: {
        created: 'Created successfully',
        updated: 'Updated successfully',
        deleted: 'Deleted successfully',
        fetched: 'Fetched successfully',
        loggedIn: 'Logged in successfully',
        loggedOut: 'Logged out successfully',
        registered: 'Registered successfully',
        verified: 'Verified successfully',
        passwordResetRequestSent: 'Password reset request sent successfully',
        passwordResetSuccessful: 'Password reset successful',
        passwordChanged: 'Password Changed'
    },

    // General Error Messages
    error: {
        internalServerError: 'Internal server error',
        badRequest: 'Bad request',
        unauthorized: 'Unauthorized',
        forbidden: 'Forbidden',
        notFound: 'Not found',
        conflict: 'Conflict', // For example, duplicate entry
        validationError: 'Validation error',
        tooManyRequests: 'Too many requests',
        serviceUnavailable: 'Service unavailable',
        invalidInput: 'Invalid input'
    },

    // Authentication and Authorization Messages
    auth: {
        wrongCredentials: 'Wrong credentials',
        emailAlreadyInUse: 'Email already in use',
        invalidToken: 'Invalid token',
        tokenExpired: 'Token expired',
        noTokenProvided: 'No token provided',
        invalidTokenFormat: 'Invalid token format',
        accountNotVerified: 'Account not verified',
        accountLocked: 'Account is locked',
        unauthenticated: 'Unauthenticated',
        blocked: 'Blocked',
        deactivate: 'Deactivated',
        active: 'Activated'
    },

    // User-Specific Messages
    user: {
        userCreated: 'User created',
        userUpdated: 'User updated',
        userDeleted: 'User deleted',
        userNotFound: 'User not found',
        userAlreadyEnrolled: 'User already enrolled'
    },

    // Admin-Specific Messages
    admin: {
        adminCreated: 'Admin created',
        adminUpdated: 'Admin updated',
        adminDeleted: 'Admin deleted',
        adminNotFound: 'Admin not found',
        adminAlreadyExists: 'Admin already exists',
        companiesFound: 'Companies Found',
        noCompaniesFound: 'No Companies Found',
        companyFound: 'Company Found',
        noCompanyFound: 'No Company Found'
    },

    // Course-Specific Messages
    course: {
        courseCreated: 'Course created',
        courseUpdated: 'Course updated',
        courseDeleted: 'Course deleted',
        courseNotFound: 'Course not found',
        courseAlreadyExists: 'Course already exists',
        courseEnrollmentSuccessful: 'Course enrollment successful',
        courseEnrollmentFailed: 'Course enrollment failed'
    },

    // Module-Specific Messages

    module: {
        moduleCreated: 'Module created',
        moduleUpdated: 'Module updated',
        moduleDeleted: 'Module deleted',
        moduleNotFound: 'Module not found'
    },

    // Assignment-Specific Messages
    assignment: {
        assignmentCreated: 'Assignment created',
        assignmentUpdated: 'Assignment updated',
        assignmentDeleted: 'Assignment deleted',
        assignmentNotFound: 'Assignment not found',
        assignmentSubmitted: 'Assignment submitted successfully'
    },

    // Company-Specific Messages (If applicable to your LMS)
    company: {
        companyCreated: 'Company created',
        companyUpdated: 'Company updated',
        companyDeleted: 'Company deleted',
        companyNotFound: 'Company not found',
        companyPlanChange: 'Plan changed'
    },

    // Employee-Specific Messages (If applicable to your LMS)
    employee: {
        employeeCreated: 'Employee created',
        employeeUpdated: 'Employee updated',
        employeeDeleted: 'Employee deleted',
        employeeNotFound: 'Employee not found',
        employeesNotFound: 'Employees not found',
        employeesFound: 'Employees found',
        employeeFound: 'Employee found',
        employeeBlock: 'Employee Blocked',
        employeeInactive: 'Employee Inactive',
        employeeActive: 'Employee Active'
    },

    // Payment related messages
    payment: {
        paymentSuccessful: 'Payment successful',
        paymentFailed: 'Payment failed',
        invalidPaymentMethod: 'Invalid payment method'
    }
};

export default apiMessages;

