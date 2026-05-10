import User from "../models/User.js";

export const deleteNotification = async (req, res) => {

    try {

        const { notificationId } = req.body;

        const user = await User.findById(
            req.user.id
        );

        if (!user) {

            return res.json({
                status: false,
                message: "User not found"
            });
        }

        user.notifications = user.notifications.filter(
            notification =>
                notification._id.toString() !== notificationId
        );

        await user.save();

        return res.json({
            status: true,
            message: "Notification deleted successfully",
            notifications: user.notifications
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });
    }
};