import User from "../models/User.js";

export const getPlaylists = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.json({
                status: false,
                message: "User not found"
            });
        }

        return res.json({
            status: true,
            playlists: user.playlists
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });
    }
};