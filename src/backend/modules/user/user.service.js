import User from "./user.model.js";

export const getUserService = async (username) => {

    const user = await User.findOne({username});

    if (!user){
        return null;
    }

    const result = {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
    }

    return result;

}