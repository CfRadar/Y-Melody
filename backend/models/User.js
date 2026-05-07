import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    token: {
      type: String
    },
    playlists: [
      {
        name: {
          type: String,
          required: true
        },
        thumbnail: String,
        caption: String,
        songs: [
          {
            title: String,
            youtubeId: String,
            artist: String,
            thumbnail: String
          }
        ],
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    history: [
      {
        title: String,
        youtubeId: String,
        artist: String,
        thumbnail: String,
        listenedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    notifications: [
      {
        title: String,
        message: String,
        read: {
          type: Boolean,
          default: false
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;