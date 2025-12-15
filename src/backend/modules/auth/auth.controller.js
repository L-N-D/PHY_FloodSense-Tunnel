import {loginService, logoutService, registerService} from './auth.service.js';

export const loginController = async (req, res) => {

    const {username, password} = req.body;

    if (!username || !password){
        return res.status(401).json('Username or Password missed');
    }

    try {

        const {accessToken, refreshToken, user} = await loginService(username, password);

        if (!accessToken || !user) {
            console.log(accessToken);
            return res.status(400).json({ message: 'Login failed' });
        }


        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' 
        });

        res.cookie('authorization', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

        // res.setHeader('authorization',  `Bearer ${accessToken}`);

        res.status(200).json({
            message: 'Login successful',
            username: user.username,
            createdAt: user.createdAt,
            email: user.email
        });
    }catch(err){
        console.log(`[Controller] | auth ${err.message}`);
        res.status(400).json({error: err.message});
    }

};

export const registerController = async (req, res) => {

    try {
        const { username, password, email } = req.body;

        if (!username || !password){
            return res.status(401).json('Username or Password missed');
        }

        const result = await registerService(username, password, email);

        if (!result) {
            return res.status(400).json({ message: 'Register fail' });
        }

        if (result.success === false){
            return res.status(400).json({message: 'User already exist'});
        }

        res.status(200).json({ message: 'Register successful' });
    }catch(err){
        console.error(err.message);
        res.status(400).json({ error: err.message });
    }
    
    
}

export const logoutController = async (req, res) => {

    try {

        const username = req.username;

        await logoutService(username);

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        res.clearCookie('authorization', {
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