import User from "../models/User.js";

export const deleteSongFromPlaylist = async (req, res) => {

    try {

        const {
            playlistId,
            songId
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

        playlist.songs = playlist.songs.filter(
            song =>
                song._id.toString() !== songId
        );

        await user.save();

        return res.json({
            status: true,
            message: "Song deleted successfully",
            playlist
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });
    }
};