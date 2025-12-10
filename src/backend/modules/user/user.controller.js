import { getUserService } from "./user.service";

export const getUserController = async (req, res) => {

    const username = req.username;

    const result = await getUserService(username);

    if (!result){
        return res.status(404).json({message: 'User not found'});
    }

    return res.status(200).json(result);

}