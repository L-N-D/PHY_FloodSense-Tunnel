import {loginService, logoutService, registerService} from './auth.service.js';

export const loginController = async (req, res) => {

    const {username, password} = req.body;

    if (!username || !password){
        return res.status(401).json('Username or Password missed');
    }

    try {

        const {accessToken, user} = await loginService(username, password);

        if (!accessToken || !user) {
            return res.status(400).json({ message: 'Login failed' });
        }


        res.cookie('accessToken', accessToken, {
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

export const registerController = async (req, res) => {

    try {
        const { username, password } = req.body;

        if (!username || !password){
            return res.status(401).json('Username or Password missed');
        }

        const user = await registerService(username, password);

        if (!user) {
            return res.status(400).json({ message: 'Register fail' });
        }

        res.status(200).json({ message: 'Register successful' });
    }catch(err){
        console.error(err);
        res.status(400).json({ error: err.message });
    }
    
    
}

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