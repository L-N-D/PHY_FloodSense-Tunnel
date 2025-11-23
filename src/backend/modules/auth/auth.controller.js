
import loginService from './auth.service';

const authLogin = (req, res) => {

    const {username, password} = req.body();

    const user = loginService(username, password);

    if (user === null){
        return res.status(404).json('Account does not exist');
    }

    if (user === false){
        return res.status(500).json('Incorrect Password');
    }

    // const payload = {
    //     id: user._id,
    //     username: user.username
    // }

    res.cookie('auth_token')



}