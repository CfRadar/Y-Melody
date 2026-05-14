import React, { useState, useEffect } from 'react';
import { api, tokenService } from '../services/api';

export default function AddToPlaylistModal({ isOpen, onClose, song }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
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
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPlaylists();
    }
  }, [isOpen]);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      const token = tokenService.getToken();
      if (token) {
        const res = await api.addSongToPlaylist(token, playlistId, song);
        if (res.status) {
          onClose(); // Successfully added
        } else {
          console.error(res.message);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-surface-container-high border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-title-lg font-bold text-on-surface mb-4">Add to Playlist</h2>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : playlists.length > 0 ? (
          <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
            {playlists.map(p => (
              <li key={p._id}>
                <button onClick={() => handleAddToPlaylist(p._id)} className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center overflow-hidden shrink-0 border border-white/5">
                    {p.songs && p.songs.length > 0 ? (
                      <img src={p.songs[0].thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-surface-variant group-hover:text-primary transition-colors">queue_music</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md text-on-surface font-medium truncate group-hover:text-primary transition-colors">{p.name}</p>
                    <p className="text-label-sm text-on-surface-variant">{p.songs?.length || 0} songs</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-md text-on-surface-variant text-center py-8">No playlists found. Create one in the sidebar!</p>
        )}
        <div className="mt-6 flex justify-end pt-4 border-t border-white/10">
          <button onClick={onClose} className="px-6 py-2 rounded-full hover:bg-white/10 text-on-surface transition-colors font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
}
