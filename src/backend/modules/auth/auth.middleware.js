import { verifyAccessToken } from "../../services/jwt.service.js";

export const authVerifyToken = async (req, res, next) => {

    try {

        const token = req.header('authorization').replace('Bearer ', '');

        const payload = await verifyAccessToken(token);

        req.username = payload.username;
        next();

    }
    catch (err){
        res.status(401).json({error: `Not authorized to access ${err}`});
    }

}