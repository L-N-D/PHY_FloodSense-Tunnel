import {SignJWT} from 'jose';
import dotenv from 'dotenv';

dotenv.config();

const generateTokenJWT = async (payload) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({payload})
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('5m')
        .sign(secret);

    return token;
}

const refreshToken = async () => {
    
}