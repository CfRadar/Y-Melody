import User from "../models/User.js";

export const getProfile = async (req, res) => {

    try {

        const user = await User.findById(
            req.user.id
        );

        if (!user) {

            return res.json({
                status: false,
                message: "User not found"
            });
        }

        return res.json({
            status: true,

            user: {
                id: user._id,
                username: user.username,
                history: user.history || []
            }
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });
    }
};