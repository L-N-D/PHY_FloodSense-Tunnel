import { verifyAccessToken, verifyRefreshToken} from '../services/jwt.service.js';

export const authAccessToken = async (req, res, next) => {

    try {

        const token = req.header('authorization').replace('Bearer ', '');

        const {payload} = await verifyAccessToken(token);

        req.username = payload;
        next();

    }
    catch (err){
        res.status(401).json({error: `Not authorized to access ${err}`});
    }
    
};

export const authRefreshToken = async (req, res, next) => {

    try {
        const token = req.cookies.refreshToken;

        // console.log(`token ${token}`);

        if (!token){
            return res.status(401).json('Access deinied: no refresh token provided');
        }

        console.log('getpayload');
        const payload = verifyRefreshToken(token);
        console.log('done');

        if (!payload){
            res.status(401).json({message: 'Invalid refreshToken'});
        }

        console.log('here');
        // console.log(payload.username);

        req.username = payload.username;
        next();
    }catch (err){
        console.error(`[Middleware] | auth.middleware.js / authRefreshToken: ${err.message}`);
        res.status(401).json({message: 'bad request'});
    }

}
