import { jwtVerify } from 'jose';
import User from '../user/user.model.js';

export const verifyToken = async (req, res, next) => {

    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Missing token' });
    }

    try {

        const accessSecret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
        const { payload } = await jwtVerify(token, accessSecret, { algorithms: ['HS256'] });

        const user = await User.findOne({username: payload.username});

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();

    } catch (err) {
        console.log(err);
        return res.status(403).json({ error: 'Token invalid or expired' });
    }

};