import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10; // You can adjust the salt rounds as needed
    return await bcrypt.hash(password, saltRounds);
};

