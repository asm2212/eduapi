import { JwtPayload } from 'jsonwebtoken';

export interface UserPayload extends JwtPayload {
    // Extends JwtPayload for standard JWT fields
    id: string;
    role: string;
    accountType: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}
