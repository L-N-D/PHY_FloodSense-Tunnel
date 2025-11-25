import User from '../user/user.model.js'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import {SignJWT} from 'jose';

dotenv.config();

const saltRound = 27;

export const registerService = async (username, password) => {

    const user = User.findOne({email: username});

    if (user){
        return null;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRound);

        const newUser = new User({username, password: hashedPassword});
        await newUser.save();

        return newUser;
    }catch (err){
        console.err(err);
        return null;
    }

}

export const loginService = async (username, password) => {

    try {
        const user = User.findOne({username});

        if (!user){
            throw new Error('User not exist');
        }

        // check is right password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (isValidPassword){

            const accessSecret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
            const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);

            // Access token generate
            const accessToken = await new SignJWT({username})
                .setProtectedHeader({alg: 'HS256'})
                .setIssuedAt()
                .setExpirationTime('5m')
                .sign(accessSecret);

            // Refresh token generate
            const refreshToken = await new SignJWT({username})
                .setProtectedHeader({alg: 'HS256'})
                .setIssuedAt()
                .setExpirationTime('5m')
                .sign(refreshSecret);

            // Save refresh token into db
            user.tokens.push(
                {
                    token: refreshToken,
                    type: 'refresh'
                }
            )
            await user.save();

            return {accessToken, user};
            
        }else{
            throw new Error('Incorrect password');
        }
    }catch (err){
        console.log(err);
        return null;
    }

};

export const logoutService = async (username) => {

    await User.updateOne({email: username},
        {$pull: {tokens: {type: 'refresh'}}}
    );

}