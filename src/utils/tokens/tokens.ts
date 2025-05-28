import jwt from 'jsonwebtoken';
import config from '../../configs/config';
import { generateUniqueId } from '../uniqueIdGenerator';
import { Tokens, UserPayload } from '../../types/tokensType';

// Extend JwtPayload to include jti
interface RefreshTokenPayload extends UserPayload {
    jti: string;
}

const accessTokenSecret = config.ACCESS_TOKEN_SECRET || '';
const refreshTokenSecret = config.REFRESH_TOKEN_SECRET || '';
const accessTokenExpiry = config.ACCESS_TOKEN_EXPIRY || '60m';
const refreshTokenExpiry = config.REFRESH_TOKEN_EXPIRY || '30d';

if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in environment or config');
}

if (!refreshTokenSecret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined in environment or config');
}

const uniqueId = generateUniqueId();

export const generateTokens = (payload: UserPayload): Tokens => {
    const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: accessTokenExpiry });
    const refreshToken = jwt.sign({ ...payload, jti: uniqueId } as RefreshTokenPayload, refreshTokenSecret, { expiresIn: refreshTokenExpiry });
    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, accessTokenSecret);

        return decoded;
    } catch {
        return null;
    }
};

export const verifyRefreshToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, refreshTokenSecret);

        return decoded;
    } catch {
        return null;
    }
};

