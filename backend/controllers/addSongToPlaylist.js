import User from "../models/User.js";

export const addSongToPlaylist = async (req, res) => {

    try {

        const {
            playlistId,

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

        // prevent duplicate songs
        const alreadyExists = playlist.songs.find(
            song => song.youtubeId === youtubeId
        );

        if (alreadyExists) {

            return res.json({
                status: false,
                message: "Song already exists in playlist"
            });
        }

        playlist.songs.unshift({
            title,
            youtubeId,
            artist,
            thumbnail
        });

        await user.save();

        return res.json({
            status: true,
            message: "Song added successfully",
            playlist
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });
    }
};