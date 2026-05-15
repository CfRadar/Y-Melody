# Y-Melodies (Organic Sound)

![Y-Melodies Hero Banner](https://via.placeholder.com/1200x400/131313/e5e2e1?text=Y-Melodies+-+Organic+Sound)

Y-Melodies is a modern, full-stack web application designed for discovering and streaming music seamlessly. It features an intuitive, highly responsive UI built with React and a robust backend powered by Node.js, Express, and MongoDB.

---

## 🚀 Key Features & Visuals

### 1. Music Discovery & Search
Instantly search for artists, moods, or frequencies using the YouTube Data API integration. View results in a highly visual grid with instant play actions.
![Discovery Screen Placeholder](https://via.placeholder.com/800x400/131313/68d3ff?text=Discovery+Screen)

### 2. Custom Playlists & Queue Management
Create, rename, delete, and manage personalized playlists. Easily add songs to your playback queue and reorder them on the fly.
![Playlist Screen Placeholder](https://via.placeholder.com/800x400/131313/68d3ff?text=Playlist+Management)

### 3. Smart Listening History & Top Artists
The app automatically tracks your playback history and curates your most-listened-to artists right in the sidebar.
![Sidebar Placeholder](https://via.placeholder.com/400x600/131313/68d3ff?text=Sidebar+with+Top+Artists)

### 4. Seamless Playback
A persistent bottom player that continues playing your tracks even as you navigate between different pages in the app.
![Player Placeholder](https://via.placeholder.com/1000x150/131313/68d3ff?text=Persistent+Audio+Player)

---

## 💻 Setup Guide

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Local instance or MongoDB Atlas)
- **YouTube Data API Key** (Required for the backend)

### Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   YOUTUBE_API_KEY=your_youtube_api_key
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (if you are running the backend locally) or let it use the default production URL:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🏗 Frontend Architecture

The frontend is built using **React** and **Vite** for blazing fast performance. The design relies heavily on **Tailwind CSS** to create a sleek, "glassmorphism" aesthetic with a dark theme.

### Component Structure
- **`App.jsx`**: The entry point that sets up `react-router-dom` and the `<ProtectedRoute>` wrapper.
- **`Layout.jsx`**: Acts as the main application shell. It renders the `Sidebar`, `TopBar`, and `Player` persistently, while using `<Outlet />` to render the page content (`Discover`, `PlaylistView`, etc.). It also manages global player state (current track, queue, playing status) and passes it down via Outlet context.
- **`Sidebar.jsx`**: Manages navigation, displays the user's playlists, and calculates the user's top artist based on their listening history.
- **`Player.jsx`**: The persistent audio player fixed to the bottom of the screen. Handles play/pause, volume control, track progression, and moving through the queue.
- **`services/api.js`**: A centralized Axios/Fetch wrapper that handles all communication with the backend, including JWT token injection.

---

## 🔌 API Endpoints Reference

The backend exposes a comprehensive REST API. All endpoints (except Auth and YouTube search) require a valid JWT token sent in the `Authorization: Bearer <token>` header.

### Authentication
- `POST /user/register` - Register a new user account.
- `POST /user/signin` - Authenticate a user and receive a JWT token.
- `GET /user/profile` - Retrieve the authenticated user's profile and listening history.

### Playlist Management
- `GET /user/playlists` - Get all playlists for the authenticated user.
- `POST /user/playlist/create` - Create a new playlist.
- `DELETE /user/playlist/delete` - Delete an existing playlist.
- `PUT /user/playlist/rename` - Rename a playlist.
- `POST /user/playlist/song/add` - Add a specific song to a playlist.
- `DELETE /user/playlist/song/delete` - Remove a song from a playlist.
- `PUT /user/playlist/song/reorder` - Reorder the songs within a playlist.

### History & Notifications
- `POST /user/history/add` - Add a played song to the user's listening history.
- `GET /user/notifications` - Retrieve all user notifications.
- `POST /user/notification/add` - Send a notification to a user.
- `DELETE /user/notification/delete` - Delete a specific notification.

### YouTube Integration
- `GET /youtube/search?q={query}` - Proxy search queries to the YouTube Data API to fetch songs and videos.

---

## 📱 Mobile App (Coming Soon!)

We are currently working on a **Flutter app** for Y-Melodies to bring the full organic sound experience directly to your iOS and Android devices. Stay tuned for updates!

---

## 📄 License

Copyright (c) 2026 Y-Melody. All rights reserved. 

This software and associated documentation files are proprietary and confidential. You may not use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software without explicit written permission from the copyright owner. See the [LICENSE](./LICENSE) file for more details.
