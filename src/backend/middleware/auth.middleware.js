import jwtVerify from 'jose';
import User from '../modules/user/user.model';
import dotenv from 'dotenv';

dotenv.config();

export const authAccessToken = async (req, res, next) => {

    try {

        const token = req.header('Authorization').replace('Bearer ', '');
        const key = new TextEncoder().encode(process.env.JWT_SECRET);

        const {payload} = await jwtVerify(token, key);

        const user = await User.findOne({
            _id: payload._id,
            'tokens.token': token,
            'tokens.type': 'access'
        });

        if (!user){
            throw new Error('User not found');
        }

        req.user = user;
        req.token = token;
        next();

    }
    catch (err){
        res.status(401).json({error: `Not authorized to access ${err}`});
    }
    
};
