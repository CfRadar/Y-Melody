const API_BASE_URL = 'https://y-melody.onrender.com';

export const api = {
  register: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data;
  },

  signin: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/user/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data;
  },

  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  },

  getPlaylists: async (token) => {
    const response = await fetch(`${API_BASE_URL}/user/playlists`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  },

  getNotifications: async (token) => {
    const response = await fetch(`${API_BASE_URL}/user/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  },

  createPlaylist: async (token, name) => {
    const response = await fetch(`${API_BASE_URL}/user/playlist/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    return data;
  },

  deletePlaylist: async (token, playlistId) => {
    const response = await fetch(`${API_BASE_URL}/user/playlist/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ playlistId }),
    });
    const data = await response.json();
    return data;
  },

  renamePlaylist: async (token, playlistId, newName) => {
    const response = await fetch(`${API_BASE_URL}/user/playlist/rename`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ playlistId, newName }),
    });
    const data = await response.json();
    return data;
  },

  addSongToPlaylist: async (token, playlistId, song) => {
    const response = await fetch(`${API_BASE_URL}/user/playlist/song/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        playlistId,
        title: song.title || song.snippet?.title,
        youtubeId: song.youtubeId || song.id?.videoId,
        artist: song.artist || song.snippet?.channelTitle,
        thumbnail: song.thumbnail || song.snippet?.thumbnails?.high?.url
      }),
    });
    const data = await response.json();
    return data;
  },

  removeSongFromPlaylist: async (token, playlistId, songId) => {
    const response = await fetch(`${API_BASE_URL}/user/playlist/song/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ playlistId, songId }),
    });
    const data = await response.json();
    return data;
  },

  reorderPlaylistSongs: async (token, playlistId, songs) => {
    const response = await fetch(`${API_BASE_URL}/user/playlist/song/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ playlistId, songs }),
    });
    const data = await response.json();
    return data;
  },

  addToHistory: async (token, track) => {
    const response = await fetch(`${API_BASE_URL}/user/history/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: track.title,
        youtubeId: track.youtubeId,
        artist: track.artist,
        thumbnail: track.thumbnail
      }),
    });
    const data = await response.json();
    return data;
  },

  searchYoutube: async (query) => {
    const response = await fetch(`${API_BASE_URL}/youtube/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  },
};

// Token Management
export const tokenService = {
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  hasToken: () => {
    return !!localStorage.getItem('authToken');
  },
};

// User Management
export const userService = {
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem('user');
  },
};
