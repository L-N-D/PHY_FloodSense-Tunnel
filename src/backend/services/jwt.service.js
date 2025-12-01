import { SignJWT, errors, jwtVerify } from 'jose';
import dotenv from 'dotenv'
import User from '../modules/user/user.model.js';

dotenv.config();

export const creatAccessToken = async (payload) => {

    const accessSecret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

    // Access token generate
    const accessToken = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('5m')
        .sign(accessSecret);

    return accessToken;

}

export const creatRefreshToken = async (payload) => {

    const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);

    // Refresh token generate
    const refreshToken = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('5m')
        .sign(refreshSecret);

    return refreshToken;

}

export const verifyAccessToken = async (token) => {

    const accessSecret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

    try {
        const { payload } = await jwtVerify(token, accessSecret, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (err) {
        console.error(`[Services] | jwt.service.js: ${err.message}`);
        return null;
    }

}

export const verifyRefreshToken = async (token) => {

    console.log(token);
    const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);

    try {
        // check is match secret key
        const { payload } = await jwtVerify(token, refreshSecret, { algorithms: ['HS256'], });

        if (!payload) {
            console.error(`[Services] | jwt.service.js / verifyRefreshToken no payload`);
            return null;
        }

        // console.log(`payload: ${payload.username}`);

        // check is valid user and still be allowed access server
        try {
            const username = payload.username;
            const user = await User.findOne({ username: username });
            if (!user) {
                return null;
            }

            // get refresh token in db
            if (!user.tokens || !user.tokens.length) {
                console.log('No refresh token in db');
                return null;
            }

            const savedRefreshToken = user.tokens.find(t => t.type === 'refresh');
            if (!savedRefreshToken) {
                console.log('No refresh token in db');
                return null;
            }

            if (savedRefreshToken.token !== token) {
                console.log('Token not match');
                return null;
            }

            console.log(payload.username);

            return payload;

        } catch (err) {
            console.error(`[Services] | jwt.service.js / verifyRefreshToken 2: ${err.message}`);
            return null;
        }

    } catch (err) {
        console.error(`[Services] | jwt.service.js / verifyRefreshToken: ${err.message}`);
        return null;
    }

}

export const refreshTokenService = async ({payload}) => {

    if (!payload){
        console.log(payload);
        console.log('refreshTokenService: no payload');
    }

    const accessToken = creatAccessToken(payload);
    const refreshToken = creatRefreshToken(payload);

    const userName = payload.username;
    // console.log(userName);

    const user = User.findOne({ username: userName });
    if (!user) {
        return null;
    }

    // get refresh token in db
    const savedRefreshToken = user.tokens.find(t => t.type === 'refresh');
    if (!savedRefreshToken) {
        return null;
    }

    savedRefreshToken.token = refreshToken;
    savedRefreshToken.createdAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    await user.save();

    return { accessToken, refreshToken, user };

}