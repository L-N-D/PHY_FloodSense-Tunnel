import User from '../user/user.model'

const loginService = (username, password) =>{

    // check is existed user?
    const user = User.findOne(username);
    
    if (!user){
        return null;
    }

}

module.exports = loginService;