import crypto from 'crypto';

// Configuration for ID generation

const ID_LENGTH = 24; // Length of the ID string
const ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateUniqueId = (): string => {
    let id = '';
    const randomBytes = crypto.randomBytes(ID_LENGTH);
    for (let i = 0; i < ID_LENGTH; i++) {
        const randomIndex = randomBytes[i] % ID_ALPHABET.length;
        id += ID_ALPHABET.charAt(randomIndex);
    }
    return id;
};
