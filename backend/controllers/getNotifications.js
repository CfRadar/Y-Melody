import User from "../models/User.js";

export const getNotifications = async (req, res) => {

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
            notifications: user.notifications
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });
    }
};