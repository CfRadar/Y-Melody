import User from '../models/User.js';

export const registerUser = async (req,res) =>{
    const{ username, password } = req.body;

    try{
        await User.create({ 
            username: username,
            passwordHash: password
        })
        res.json({
            status: true,
            message: "User registered successfully"
        })
    }catch(error){
        res.json({
            status: false,
            message: "Error registering user"
        })
    }
}