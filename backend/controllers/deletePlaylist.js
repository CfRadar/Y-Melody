import User from "../models/User.js";

export const deletePlaylist = async (req, res) => {

    try {

        const { playlistId } = req.body;

        const user = await User.findById(
            req.user.id
        );

        if (!user) {

            return res.json({
                status: false,
                message: "User not found"
            });
        }

        user.playlists = user.playlists.filter(
            playlist =>
                playlist._id.toString() !== playlistId
        );

        await user.save();

        return res.json({
            status: true,
            message: "Playlist deleted successfully",
            playlists: user.playlists
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });
    }
};