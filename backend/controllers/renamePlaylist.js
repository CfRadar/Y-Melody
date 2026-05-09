import User from "../models/User.js";

export const renamePlaylist = async (req, res) => {

    try {

        const {
            playlistId,
            newName
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

        const playlist = user.playlists.find(
            playlist =>
                playlist._id.toString() === playlistId
        );

        if (!playlist) {

            return res.json({
                status: false,
                message: "Playlist not found"
            });
        }

        playlist.name = newName;

        await user.save();

        return res.json({
            status: true,
            message: "Playlist renamed successfully",
            playlist
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });
    }
};