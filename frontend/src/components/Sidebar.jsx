import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, tokenService } from '../services/api';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = tokenService.getToken();
        if (token) {
          const res = await api.getPlaylists(token);
          if (res.status && res.playlists) {
            setPlaylists(res.playlists);
          }
        }
      } catch (err) {
        console.error('Error fetching playlists:', err);
      }
    };
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCreatePlaylist = async () => {
    const name = window.prompt("Enter new playlist name:");
    if (!name || !name.trim()) return;
    try {
      const token = tokenService.getToken();
      if (token) {
        const res = await api.createPlaylist(token, name.trim());
        if (res.status && res.playlists) {
          setPlaylists(res.playlists);
        }
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
    }
  };

  const handleRenamePlaylist = async (id, currentName) => {
    const newName = window.prompt("Enter new name for playlist:", currentName);
    if (!newName || !newName.trim() || newName === currentName) return;
    try {
      const token = tokenService.getToken();
      if (token) {
        const res = await api.renamePlaylist(token, id, newName.trim());
        if (res.status && res.playlist) {
          setPlaylists(prev => prev.map(p => p._id === id ? res.playlist : p));
        }
      }
    } catch (err) {
      console.error('Error renaming playlist:', err);
    }
  };

  const handleDeletePlaylist = async (id) => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;
    try {
      const token = tokenService.getToken();
      if (token) {
        const res = await api.deletePlaylist(token, id);
        if (res.status && res.playlists) {
          setPlaylists(res.playlists);
          if (location.pathname === `/playlist/${id}`) {
            navigate('/discover');
          }
        }
      }
    } catch (err) {
      console.error('Error deleting playlist:', err);
    }
  };

  return (
    <nav className="hidden md:flex flex-col bg-surface-container-low/60 backdrop-blur-3xl border-r border-white/5 shadow-xl fixed left-0 top-0 w-64 h-screen z-40 p-md justify-between transition-all duration-300">
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex items-center gap-sm mb-xl px-2 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <div>
            <h1 className="text-headline-md font-display-md font-bold text-primary truncate">Y-Melodies</h1>
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest opacity-80 truncate">Organic Sound</p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex flex-col gap-xs font-label-lg text-label-lg shrink-0">
          <Link to="/" className={`flex items-center gap-sm px-4 py-2 rounded-full transition-all hover:translate-x-1 ${location.pathname === '/' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/10'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
            Home
          </Link>
          <Link to="/discover" className={`flex items-center gap-sm px-4 py-2 rounded-full transition-all hover:translate-x-1 ${location.pathname.startsWith('/discover') ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/10'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname.startsWith('/discover') ? "'FILL' 1" : "'FILL' 0" }}>explore</span>
            Discover
          </Link>

        </div>

        {/* Playlists List (Mini) */}
        <div className="mt-8 mb-4 border-t border-white/5 pt-4 flex-1 overflow-y-auto hide-scrollbar relative">
          <div className="flex items-center justify-between mb-4 px-4 sticky top-0 bg-surface-container-low/90 backdrop-blur-md z-10 py-1">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest m-0">Your Playlists</p>
            <button onClick={handleCreatePlaylist} className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-white/10" title="Create Playlist">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
          <ul className="flex flex-col gap-1 pb-4">
            {playlists.map(playlist => (
              <li key={playlist._id} className="relative group flex items-center px-2">
                <Link to={`/playlist/${playlist._id}`} className={`flex-1 px-2 py-1.5 text-on-surface-variant hover:text-on-surface font-body-md text-sm truncate hover:bg-white/5 rounded-md transition-colors ${location.pathname === `/playlist/${playlist._id}` ? 'text-primary font-medium' : ''}`}>
                  {playlist.name}
                </Link>
                <button
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpenMenuId(openMenuId === playlist._id ? null : playlist._id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-primary transition-all rounded-full hover:bg-white/10 shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
                {openMenuId === playlist._id && (
                  <div className="absolute right-2 top-8 w-36 bg-surface-container-high border border-white/10 rounded-lg shadow-2xl py-1 z-50 animate-fade-in origin-top-right">
                    <button onClick={(e) => { e.stopPropagation(); handleRenamePlaylist(playlist._id, playlist.name); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-body-sm text-on-surface hover:bg-white/5 hover:text-primary transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">edit</span> Rename
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(playlist._id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-body-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
            {playlists.length === 0 && (
              <li className="px-4 py-1.5 text-on-surface-variant/50 text-sm">No playlists yet</li>
            )}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-auto shrink-0">
          <div className="flex justify-between items-center px-2 pt-4 border-t border-white/5">
            <Link to="#" className="text-on-surface-variant hover:text-on-surface transition-colors p-2 hover:bg-white/10 rounded-full" title="Help">
              <span className="material-symbols-outlined">help</span>
            </Link>
            <button onClick={() => window.location.href = '/login'} className="text-on-surface-variant hover:text-on-surface transition-colors p-2 hover:bg-white/10 rounded-full" title="Logout">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
