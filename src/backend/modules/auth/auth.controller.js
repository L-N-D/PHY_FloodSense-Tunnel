import {loginService, logoutService} from './auth.service.js';

export const loginController = async (req, res) => {

    const {username, password} = req.body;

    if (!username || !password){
        return res.status(401).json('Username or Password missed');
    }

    try {

        const {token, user} = await loginService(username, password);

        res.cookies('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        res.status(200).json({message: 'Login successful'});
    }catch(err){
        console.log(err);
        res.status(400).json({error: err.message});
    }

};

export const logoutController = async (req, res) => {

    try {

        const username = req.user.username;

        await logoutService(username);

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        res.status(200).json({ message: 'Logout successful' });

    }catch(err){
        console.log(err);
        res.status(400).json({ error: err.message });
    }
    
}