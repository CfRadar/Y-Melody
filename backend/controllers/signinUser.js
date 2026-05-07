import jwt from "jsonwebtoken";
import User from "../models/User.js";
import generateToken from "../middlewares/generateToken.js";
import env from "../config/env.js";

export const signinUser = async (req, res) => {

    try {

        const { username, password, token } = req.body;

        if (token) {

            const decoded = jwt.verify(
                token,
                env.JWT_SECRET
            );

            const user = await User.findById(decoded.id);

            if (!user) {
                return res.json({
                    status: false,
                    message: "User not found"
                });
            }

            return res.json({
                status: true,
                message: "Login successful",

                user: {
                    id: user._id,
                    username: user.username
                },

                token
            });
        }


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

        const newToken = generateToken(user._id);

        return res.json({
            status: true,
            message: "Login successful",

            user: {
                id: user._id,
                username: user.username
            },

            token: newToken
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });
    }
};