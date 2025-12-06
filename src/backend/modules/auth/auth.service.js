import User from '../user/user.model.js'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { creatAccessToken, creatRefreshToken } from '../../services/jwt.service.js';


dotenv.config();

const saltRound = 10;

export const registerService = async (username, email, password) => {

    try {

        const user = await User.findOne({ username});

        if (user) {
            return { success: false, message: 'User already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, saltRound);
        const newUser = new User({ username: username, email: email, password: hashedPassword });

        await newUser.save();

        return { success: true, newUser};
    } catch (err) {
        console.error(err);
        return { success: false, message: err.message };
    }

}

export const loginService = async (username, password) => {

    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            throw new Error('User not exist');
        }

        // check is right password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (isValidPassword) {

            // create access token and refresh token
            const payload = {
                username: username
            }
            const accessToken = await creatAccessToken(payload);
            const refreshToken = await creatRefreshToken(payload);

            const existToken = user.tokens.find(t => t.type === 'refresh');
            if (existToken){
                await User.updateOne({ username: username },
                    { $pull: { tokens: { type: 'refresh' } } });
            }

            // Save refresh token into db
            user.tokens.push(
                {
                    token: refreshToken,
                    type: 'refresh',
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
                }
            )
            await user.save();

            return { accessToken, refreshToken, user };

        } else {
            throw new Error('Incorrect password');
        }
    } catch (err) {
        console.log('[Service] | loginService.js ', err);
        return null;
    }

};

export const logoutService = async (username) => {

    const result = await User.updateOne({ username: username },
        { $pull: { tokens: { type: 'refresh' } } }
    );

    // console.log(result);

}