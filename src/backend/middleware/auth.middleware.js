import { verifyAccessToken, verifyRefreshToken} from '../services/jwt.service.js';

export const authAccessToken = async (req, res, next) => {

    try {

        const token = req.header('authorization').replace('Bearer ', '');

        const payload = await verifyAccessToken(token);

        req.username = payload.username;
        next();

    }
    catch (err){
        return res.status(401).json({error: `Not authorized to access ${err}`});
    }
    
};

export const authRefreshToken = async (req, res, next) => {

    try {
        const token = req.cookies.refreshToken;

        if (!token){
            return res.status(401).json('Access deinied: no refresh token provided');
        }

        const payload = await verifyRefreshToken(token);

        if (!payload){
            return res.status(401).json({message: 'Invalid refreshToken'});
        }

        req.username = payload.username;
        next();
    }catch (err){
        console.error(`[Middleware] | auth.middleware.js / authRefreshToken: ${err.message}`);
        return res.status(401).json({message: 'bad request'});
    }

}
