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
const verificationTokenSecret = config.VERIFICATION_TOKEN_SECRET || '';
const forgetPasswordTokenSecret = config.FORGET_PASSWORD_TOKEN_SECRET || '';
const accessTokenExpiry = config.ACCESS_TOKEN_EXPIRY || '60m';
const refreshTokenExpiry = config.REFRESH_TOKEN_EXPIRY || '30d';
const verificationTokenExpiry = config.VERIFICATION_TOKEN_EXPIRY || '2d';
const forgetPasswordTokenExpiry = config.FORGET_PASSWORD_TOKEN_EXPIRY || '1d';

if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in environment or config');
}

if (!refreshTokenSecret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined in environment or config');
}

if (!verificationTokenSecret) {
    throw new Error('VERIFICATION_TOKEN_SECRET is not defined in environment or config');
}

if (!forgetPasswordTokenSecret) {
    throw new Error('FORGET_PASSWORD_TOKEN is not defined in environment or config');
}

const uniqueId = generateUniqueId();

export const generateTokens = (payload: UserPayload): Tokens => {
    const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: accessTokenExpiry });
    const refreshToken = jwt.sign({ ...payload, jti: uniqueId } as RefreshTokenPayload, refreshTokenSecret, { expiresIn: refreshTokenExpiry });
    return { accessToken, refreshToken };
};

export const generateVerificationToken = (payload: UserPayload) => {
    const verificationToken = jwt.sign(payload, verificationTokenSecret, {
        expiresIn: verificationTokenExpiry
    });
    return verificationToken;
};

export const generateForgetPasswordToken = (payload: UserPayload) => {
    const forgetPasswordToken = jwt.sign(payload, forgetPasswordTokenSecret, {
        expiresIn: forgetPasswordTokenExpiry
    });
    return forgetPasswordToken;
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

export const verifyVerificationToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, verificationTokenSecret);
        return decoded;
    } catch (error) {
        return null;
    }
};

export const verifyForgetPasswordToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, forgetPasswordTokenSecret);
        return decoded;
    } catch (error) {
        return null;
    }
};

