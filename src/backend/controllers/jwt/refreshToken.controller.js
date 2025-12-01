import { refreshTokenService } from "../../services/jwt.service.js";

export const refreshTokenController = async (req, res) => {

    const payload = {
        username: req.username,
    };

    const { accessToken, refreshToken, user } = await refreshTokenService(payload);

    if (!accessToken || !refreshToken || !user) {
        res.status(401).json({ message: 'Refresh Token fail' });
    }

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    res.setHeader('authorization', `Bearer ${accessToken}`);

    res.status(200).json({message: 'refresh token successful'});

}