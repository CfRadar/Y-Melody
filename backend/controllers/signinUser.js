import User from "../models/User.js";

import generateToken from "../middlewares/generateToken.js";

export const signinUser = async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await User.findOne({
            username
        });

        if (!user) {

            return res.json({
                status: false,
                message: "User not found"
            });
        }

        // plain password check
        if (password !== user.passwordHash) {

            return res.json({
                status: false,
                message: "Invalid password"
            });
        }

        const token = generateToken(
            user._id
        );

        return res.json({
            status: true,
            message: "Login successful",

            user: {
                id: user._id,
                username: user.username
            },

            token
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });
    }
};