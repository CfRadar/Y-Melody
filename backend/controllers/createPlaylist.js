import User from "../models/User.js";

export const createPlaylist = async (req, res) => {

    try {

        const {
            name,
            thumbnail,
            caption
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

        user.playlists.unshift({
            name,
            thumbnail,
            caption,
            songs: []
        });

        await user.save();

        return res.json({
            status: true,
            message: "Playlist created successfully",
            playlists: user.playlists
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });
    }
};