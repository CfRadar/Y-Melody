import User from '../models/User.js';

export const registerUser = async (req,res) =>{
    const{ username, password } = req.body;

    try{
        await User.create({ 
            username: username,
            passwordHash: password
        })
        res.status(201).json({
            status: true,
            message: "User registered successfully"
        })
    }catch(error){
        console.log("Registration Error:", error.code, error.message);
        if (error.code === 11000) {
            return res.status(400).json({
                status: false,
                message: "Username already exists"
            });
        }
        res.status(500).json({
            status: false,
            message: "Error registering user: " + error.message
        })
    }
}