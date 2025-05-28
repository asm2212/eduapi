import bcrypt from 'bcryptjs';

const comparePassword = (userInputPassword: string, userStoredPassword: string) => {
    return bcrypt.compare(userInputPassword, userStoredPassword);
};

export default comparePassword;
