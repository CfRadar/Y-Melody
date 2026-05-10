# Y-Melody Backend API Documentation

## Overview
Complete API documentation for the Y-Melody music streaming application backend. The API uses JWT-based authentication for protected routes and MongoDB for data persistence.

---

## Authentication

The API uses Bearer token authentication via JWT (JSON Web Tokens). Protected endpoints require the following header:

```
Authorization: Bearer <jwt_token>
```

The token expires after 30 days and is issued upon successful user login.

---

## API Endpoints

### 1. User Registration

**Endpoint:** `POST /user/register`

**Authentication:** No

**Purpose:** Register a new user account

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secure_password_123"
}
```

**Success Response (201):**
```json
{
  "status": true,
  "message": "User registered successfully"
}
```

**Failure Response (400):**
```json
{
  "status": false,
  "message": "Error registering user"
}
```

**Notes:**
- Username must be unique (enforced by MongoDB schema)
- Password is stored in plain text (⚠️ SECURITY ISSUE - See Issues section)
- No password validation (length, complexity)

---

### 2. User Sign In

**Endpoint:** `POST /user/signin`

**Authentication:** No

**Purpose:** Authenticate user and receive JWT token

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secure_password_123"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Failure Response (401):**
```json
{
  "status": false,
  "message": "User not found"
}
```

OR

```json
{
  "status": false,
  "message": "Invalid password"
}
```

**Notes:**
- Password comparison is done in plain text (⚠️ SECURITY ISSUE)
- Token expires in 30 days
- Token should be stored in client localStorage/sessionStorage

---

### 3. Get User Profile

**Endpoint:** `GET /user/profile`

**Authentication:** Yes (Required)

**Purpose:** Retrieve authenticated user's profile information

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:** None

**Success Response (200):**
```json
{
  "status": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe"
  }
}
```

**Failure Response (401):**
```json
{
  "status": false,
  "message": "No token provided"
}
```

OR

```json
{
  "status": false,
  "message": "Invalid token"
}
```

---

### 4. Get All Playlists

**Endpoint:** `GET /user/playlists`

**Authentication:** Yes (Required)

**Purpose:** Retrieve all playlists for authenticated user

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:** None

**Success Response (200):**
```json
{
  "status": true,
  "playlists": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Favorite Hits",
      "thumbnail": "https://example.com/image.jpg",
      "caption": "My favorite songs",
      "songs": [
        {
          "_id": "507f1f77bcf86cd799439013",
          "title": "Song Title",
          "youtubeId": "dQw4w9WgXcQ",
          "artist": "Artist Name",
          "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Failure Response (401):**
```json
{
  "status": false,
  "message": "No token provided"
}
```

---

### 5. Create Playlist

**Endpoint:** `POST /user/playlist/create`

**Authentication:** Yes (Required)

**Purpose:** Create a new playlist

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Workout Mix",
  "thumbnail": "https://example.com/playlist-thumb.jpg",
  "caption": "High energy workout songs"
}
```

**Success Response (201):**
```json
{
  "status": true,
  "message": "Playlist created successfully",
  "playlists": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Workout Mix",
      "thumbnail": "https://example.com/playlist-thumb.jpg",
      "caption": "High energy workout songs",
      "songs": [],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Failure Response (401):**
```json
{
  "status": false,
  "message": "Invalid token"
}
```

---

### 6. Delete Playlist

**Endpoint:** `DELETE /user/playlist/delete`

**Authentication:** Yes (Required)

**Purpose:** Delete an existing playlist

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "playlistId": "507f1f77bcf86cd799439012"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Playlist deleted successfully",
  "playlists": []
}
```

**Failure Response (400):**
```json
{
  "status": false,
  "message": "Playlist not found"
}
```

---

### 7. Rename Playlist

**Endpoint:** `PUT /user/playlist/rename`

**Authentication:** Yes (Required)

**Purpose:** Rename an existing playlist

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "playlistId": "507f1f77bcf86cd799439012",
  "newName": "Updated Playlist Name"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Playlist renamed successfully",
  "playlist": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Updated Playlist Name",
    "thumbnail": "https://example.com/playlist-thumb.jpg",
    "caption": "High energy workout songs",
    "songs": [],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Failure Response (400):**
```json
{
  "status": false,
  "message": "Playlist not found"
}
```

---

### 8. Add Song to Playlist

**Endpoint:** `POST /user/playlist/song/add`

**Authentication:** Yes (Required)

**Purpose:** Add a song to a playlist

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "playlistId": "507f1f77bcf86cd799439012",
  "title": "Blinding Lights",
  "youtubeId": "4NRXx6U8ABQ",
  "artist": "The Weeknd",
  "thumbnail": "https://i.ytimg.com/vi/4NRXx6U8ABQ/default.jpg"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Song added successfully",
  "playlist": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Workout Mix",
    "songs": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Blinding Lights",
        "youtubeId": "4NRXx6U8ABQ",
        "artist": "The Weeknd",
        "thumbnail": "https://i.ytimg.com/vi/4NRXx6U8ABQ/default.jpg"
      }
    ]
  }
}
```

**Failure Response (400):**
```json
{
  "status": false,
  "message": "Song already exists in playlist"
}
```

OR

```json
{
  "status": false,
  "message": "Playlist not found"
}
```

---

### 9. Delete Song from Playlist

**Endpoint:** `DELETE /user/playlist/song/delete`

**Authentication:** Yes (Required)

**Purpose:** Remove a song from a playlist

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "playlistId": "507f1f77bcf86cd799439012",
  "songId": "507f1f77bcf86cd799439013"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Song deleted successfully",
  "playlist": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Workout Mix",
    "songs": []
  }
}
```

**Failure Response (400):**
```json
{
  "status": false,
  "message": "Playlist not found"
}
```

---

### 10. Reorder Playlist Songs

**Endpoint:** `PUT /user/playlist/song/reorder`

**Authentication:** Yes (Required)

**Purpose:** Reorder songs within a playlist

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "playlistId": "507f1f77bcf86cd799439012",
  "songs": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "title": "Song 2",
      "youtubeId": "dQw4w9WgXcQ",
      "artist": "Artist 2",
      "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Song 1",
      "youtubeId": "4NRXx6U8ABQ",
      "artist": "Artist 1",
      "thumbnail": "https://i.ytimg.com/vi/4NRXx6U8ABQ/default.jpg"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Playlist arranged successfully",
  "playlist": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Workout Mix",
    "songs": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "title": "Song 2",
        "youtubeId": "dQw4w9WgXcQ",
        "artist": "Artist 2",
        "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg"
      },
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Song 1",
        "youtubeId": "4NRXx6U8ABQ",
        "artist": "Artist 1",
        "thumbnail": "https://i.ytimg.com/vi/4NRXx6U8ABQ/default.jpg"
      }
    ]
  }
}
```

**Failure Response (400):**
```json
{
  "status": false,
  "message": "Playlist not found"
}
```

---

### 11. Add to History

**Endpoint:** `POST /user/history/add`

**Authentication:** Yes (Required)

**Purpose:** Add a song to user's listening history (maintains last 50 songs)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Blinding Lights",
  "youtubeId": "4NRXx6U8ABQ",
  "artist": "The Weeknd",
  "thumbnail": "https://i.ytimg.com/vi/4NRXx6U8ABQ/default.jpg"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "History updated successfully",
  "history": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "title": "Blinding Lights",
      "youtubeId": "4NRXx6U8ABQ",
      "artist": "The Weeknd",
      "thumbnail": "https://i.ytimg.com/vi/4NRXx6U8ABQ/default.jpg",
      "listenedAt": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

**Failure Response (401):**
```json
{
  "status": false,
  "message": "No token provided"
}
```

**Notes:**
- Automatically removes duplicates (keeps most recent)
- Maintains only last 50 songs
- Older entries are automatically removed

---

### 12. Add Notification

**Endpoint:** `POST /user/notification/add`

**Authentication:** Yes (Required)

**Purpose:** Add a notification for a user

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "title": "Playlist Shared",
  "message": "john_doe shared 'Workout Mix' playlist with you"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Notification added successfully",
  "notifications": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "title": "Playlist Shared",
      "message": "john_doe shared 'Workout Mix' playlist with you",
      "read": false,
      "createdAt": "2024-01-15T10:40:00.000Z"
    }
  ]
}
```

**Failure Response (400):**
```json
{
  "status": false,
  "message": "User not found"
}
```

**⚠️ Security Issue:** This endpoint accepts `userId` from request body instead of using authenticated user's ID. Users can add notifications to any user account.

---

### 13. Delete Notification

**Endpoint:** `DELETE /user/notification/delete`

**Authentication:** Yes (Required)

**Purpose:** Delete a notification

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "notificationId": "507f1f77bcf86cd799439016"
}
```

**Success Response (200):**
```json
{
  "status": true,
  "message": "Notification deleted successfully",
  "notifications": []
}
```

**Failure Response (400):**
```json
{
  "status": false,
  "message": "User not found"
}
```

---

### 14. Get Notifications

**Endpoint:** `GET /user/notifications`

**Authentication:** Yes (Required)

**Purpose:** Retrieve all notifications for authenticated user

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:** None

**Success Response (200):**
```json
{
  "status": true,
  "notifications": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "title": "Playlist Shared",
      "message": "john_doe shared 'Workout Mix' playlist with you",
      "read": false,
      "createdAt": "2024-01-15T10:40:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439017",
      "title": "New Feature",
      "message": "Check out our new reordering feature!",
      "read": true,
      "createdAt": "2024-01-14T14:20:00.000Z"
    }
  ]
}
```

**Failure Response (401):**
```json
{
  "status": false,
  "message": "Invalid token"
}
```

---

### 15. YouTube Video Search

**Endpoint:** `GET /youtube/search`

**Authentication:** No

**Purpose:** Search for videos on YouTube using YouTube Data API v3

**Headers:**
```
Content-Type: application/json
```

**Query Parameters:**
- `q` (required): Search query string

**Example Request:**
```
GET /youtube/search?q=The%20Weeknd%20Blinding%20Lights
```

**Success Response (200):**
```json
[
  {
    "kind": "youtube#searchResult",
    "etag": "xyz123",
    "id": {
      "kind": "youtube#video",
      "videoId": "4NRXx6U8ABQ"
    },
    "snippet": {
      "publishedAt": "2020-01-01T00:00:00Z",
      "title": "The Weeknd - Blinding Lights (Official Video)",
      "description": "Official music video...",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/4NRXx6U8ABQ/default.jpg",
          "width": 120,
          "height": 90
        }
      },
      "channelTitle": "The Weeknd",
      "liveBroadcastContent": "none"
    }
  }
]
```

**Failure Response (500):**
```
(No response - endpoint doesn't return error response)
```

**Notes:**
- Returns maximum 5 results
- Requires valid `YOUTUBE_DATA_API_KEY` in environment variables
- ⚠️ Missing error handling - no error response sent to client on failure

---

## API Summary

### Total Routes
- **Total Endpoints:** 15
- **Protected Routes (JWT Required):** 11
- **Public Routes:** 4 (register, signin, youtube search, and its error handling)

### Route Breakdown

| # | Method | Path | Protected | Controller |
|----|--------|------|-----------|-----------|
| 1 | POST | /user/register | No | registerUser |
| 2 | POST | /user/signin | No | signinUser |
| 3 | GET | /user/profile | Yes | getProfile |
| 4 | GET | /user/playlists | Yes | getPlaylists |
| 5 | POST | /user/playlist/create | Yes | createPlaylist |
| 6 | DELETE | /user/playlist/delete | Yes | deletePlaylist |
| 7 | PUT | /user/playlist/rename | Yes | renamePlaylist |
| 8 | POST | /user/playlist/song/add | Yes | addSongToPlaylist |
| 9 | DELETE | /user/playlist/song/delete | Yes | deleteSongFromPlaylist |
| 10 | PUT | /user/playlist/song/reorder | Yes | reorderPlaylistSongs |
| 11 | POST | /user/history/add | Yes | addToHistory |
| 12 | POST | /user/notification/add | Yes | addNotification |
| 13 | DELETE | /user/notification/delete | Yes | deleteNotification |
| 14 | GET | /user/notifications | Yes | getNotifications |
| 15 | GET | /youtube/search | No | Direct handler |

---

## Detected Issues & Bugs

### 🔴 CRITICAL ISSUES

#### 1. **Plain Text Password Storage** [registerUser.js]
- **Issue:** Passwords are stored in plain text in the database
- **Impact:** Complete compromise if database is breached
- **Fix:** Use bcrypt to hash passwords before storing
```javascript
// Current (WRONG)
passwordHash: password

// Should be
const hashedPassword = await bcrypt.hash(password, 10);
passwordHash: hashedPassword
```

#### 2. **Plain Text Password Comparison** [signinUser.js]
- **Issue:** Passwords compared directly without hashing
- **Impact:** Defeats any hashing scheme
- **Fix:** Use bcrypt.compare()
```javascript
// Current (WRONG)
if (password !== user.passwordHash) { }

// Should be
const isValid = await bcrypt.compare(password, user.passwordHash);
if (!isValid) { }
```

#### 3. **Security Bypass in Notification Addition** [addNotification.js]
- **Issue:** Accepts `userId` from request body instead of using authenticated user
- **Impact:** Any authenticated user can add notifications to any other user
- **Fix:** Use `req.user.id` from JWT middleware
```javascript
// Current (VULNERABLE)
const { userId, title, message } = req.body;
const user = await User.findById(userId);

// Should be
const { title, message } = req.body;
const user = await User.findById(req.user.id);
```

#### 4. **Database Connection Error** [db.js]
- **Issue:** Typo in import - `moongoose` instead of `mongoose`
- **Impact:** Database connection will fail - server cannot start
- **Fix:** Correct the import
```javascript
// Current (WRONG)
import moongoose from 'mongoose';

// Should be
import mongoose from 'mongoose';
```

### 🟡 HIGH PRIORITY ISSUES

#### 5. **Missing Error Response in YouTube Search** [youtubeRoute.js]
- **Issue:** Catch block doesn't send response to client
- **Impact:** Requests hang or timeout when errors occur
- **Fix:** Return error response
```javascript
}catch(error){
    console.error("Error in YouTube search route:", error);
    res.status(500).json({
        status: false,
        message: "Error searching videos"
    });
}
```

#### 6. **No Duplicate Username Handling** [registerUser.js]
- **Issue:** While MongoDB enforces uniqueness, no specific error message
- **Impact:** Users get generic "Error registering user" message
- **Fix:** Catch and handle duplicate key error specifically
```javascript
}catch(error){
    if (error.code === 11000) {
        return res.status(400).json({
            status: false,
            message: "Username already exists"
        });
    }
    return res.status(500).json({
        status: false,
        message: "Error registering user"
    });
}
```

### 🟠 MEDIUM PRIORITY ISSUES

#### 7. **No Input Validation**
- **Issue:** None of the endpoints validate input data
- **Impact:** Invalid data passed to database; garbage in = garbage out
- **Endpoints Affected:** All POST/PUT endpoints
- **Recommended:** Use validation library (e.g., joi, zod)

#### 8. **No Password Validation on Registration**
- **Issue:** Passwords with no length or complexity requirements
- **Impact:** Users can set single-character passwords
- **Fix:** Implement minimum password requirements

#### 9. **Generic Error Messages**
- **Issue:** Most errors return generic messages without helpful debugging info
- **Impact:** Poor user experience and difficult to debug client-side
- **Recommended:** Return specific error messages while protecting sensitive info

#### 10. **Missing HTTP Status Codes**
- **Issue:** All responses use 200 or default status code
- **Impact:** Clients cannot distinguish between success/failure properly
- **Recommendation:**
  - 200: GET/DELETE success
  - 201: POST create success
  - 400: Bad request/validation error
  - 401: Authentication error
  - 404: Not found
  - 500: Server error

---

## Security Recommendations

### Immediate Actions Required
1. ✅ Fix typo in `db.js` (moongoose → mongoose)
2. ✅ Implement bcrypt password hashing in registerUser
3. ✅ Implement bcrypt password verification in signinUser
4. ✅ Fix addNotification to use `req.user.id` instead of accepting userId from body
5. ✅ Add error response to YouTube search route

### Short-term Improvements
1. Implement input validation on all endpoints
2. Add specific error handling for duplicate users
3. Use proper HTTP status codes
4. Add password complexity requirements
5. Implement rate limiting on auth endpoints

### Long-term Improvements
1. Add refresh token rotation
2. Implement permission checks (authorization)
3. Add audit logging for sensitive operations
4. Add data encryption at rest
5. Add HTTPS/TLS enforcement
6. Consider OAuth 2.0 for third-party auth
7. Add API rate limiting globally

---

## Database Schema

### User Model
```
{
  username: String (unique, required),
  passwordHash: String (required),
  token: String,
  playlists: [
    {
      name: String,
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
      createdAt: Date
    }
  ],
  history: [
    {
      title: String,
      youtubeId: String,
      artist: String,
      thumbnail: String,
      listenedAt: Date
    }
  ],
  notifications: [
    {
      title: String,
      message: String,
      read: Boolean,
      createdAt: Date
    }
  ],
  timestamps: true
}
```

---

## Environment Variables Required

```
PORT=5000
DATABASE_URL=mongodb://localhost:27017/y-melody
YOUTUBE_DATA_API_KEY=your_youtube_api_key_here
JWT_SECRET=your_jwt_secret_key_here
```

---

## Testing Checklist

- [ ] Register endpoint creates new users
- [ ] Register prevents duplicate usernames
- [ ] Sign in returns valid JWT token
- [ ] Protected routes reject requests without token
- [ ] Protected routes reject invalid tokens
- [ ] Get profile returns correct user data
- [ ] All playlist operations work correctly
- [ ] Duplicate song prevention works
- [ ] History maintains only last 50 songs
- [ ] Notifications can be added and deleted
- [ ] YouTube search returns results
- [ ] Passwords are actually hashed (verify in database)
- [ ] All error responses include proper messages

---

## Deployment Notes

1. Ensure all environment variables are set before deployment
2. Database must be running and accessible
3. YouTube Data API key must be valid
4. JWT_SECRET should be a strong random string (minimum 32 characters)
5. Consider using reverse proxy (nginx) for production
6. Enable CORS properly for your frontend domain
7. Consider adding request logging middleware
8. Set up monitoring and error tracking

---

**Documentation Generated:** January 15, 2024
**Last Updated:** January 15, 2024
