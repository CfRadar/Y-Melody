import User from "../models/User.js";

export const addNotification = async (req, res) => {

    try {

        const {
            userId,
            title,
            message
        } = req.body;

        const user = await User.findById(
            userId
        );

        if (!user) {

            return res.json({
                status: false,
                message: "User not found"
            });
        }

        user.notifications.unshift({
            title,
            message
        });

        await user.save();

        return res.json({
            status: true,
            message: "Notification added successfully",
            notifications: user.notifications
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });
    }
};