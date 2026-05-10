import User from "../models/User.js";

export const addToHistory = async (req, res) => {

    try {

        const {
            title,
            youtubeId,
            artist,
            thumbnail
        } = req.body;

        const user = await User.findById(
            req.user.id
        );

        if (!user) {

            return res.json({
                status: false,
                message: "User not found"
            });
        }

        // remove duplicate song if exists
        user.history = user.history.filter(
            song => song.youtubeId !== youtubeId
        );

        // add latest song at top
        user.history.unshift({
            title,
            youtubeId,
            artist,
            thumbnail
        });

        // keep only last 50
        if (user.history.length > 50) {

            user.history = user.history.slice(0, 50);
        }

        await user.save();

        return res.json({
            status: true,
            message: "History updated successfully",
            history: user.history
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });
    }
};