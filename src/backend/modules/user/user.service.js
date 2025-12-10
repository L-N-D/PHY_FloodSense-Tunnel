import User from "./user.model.js";

export const getUserService = async (username) => {

    const user = await User.findOne({username});

    if (!user){
        return null;
    }

    const result = {
        username: user.username
    }

    return result;

}