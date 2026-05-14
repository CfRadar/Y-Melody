import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { api, tokenService } from '../services/api';

export default function PlaylistView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [draggedSongIndex, setDraggedSongIndex] = useState(null);
  const [draggedOverSongIndex, setDraggedOverSongIndex] = useState(null);
  const { isPlaying, setIsPlaying, currentTrack, setCurrentTrack, queue, setQueue, setModalSong } = useOutletContext();

  useEffect(() => {
    const fetchPlaylist = async () => {
      const token = tokenService.getToken();
      if (!token) return;

      try {
        const response = await api.getPlaylists(token);
        if (response.status && response.playlists) {
          const found = response.playlists.find(p => p._id === id);
          if (found) {
            setPlaylist(found);
          } else {
            setError('Playlist not found');
          }
        }
      } catch (err) {
        console.error('Error fetching playlist:', err);
        setError('Error loading playlist');
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handlePlayAll = () => {
    if (playlist?.songs?.length > 0) {
      // Play the first song
      setCurrentTrack(playlist.songs[0]);
      setIsPlaying(true);
      // Set the rest of the songs as the queue
      const newQueue = playlist.songs.slice(1);
      setQueue(newQueue);
    }
  };

  const handleAddToQueue = (e, song) => {
    e.stopPropagation();
    if (queue) {
      setQueue([...queue, song]);
    } else {
      setQueue([song]);
    }
    setOpenMenuId(null);
  };

  const handleAddToPlaylist = (e, song) => {
    e.stopPropagation();
    setModalSong(song);
    setOpenMenuId(null);
  };

  const handleRemoveFromPlaylist = async (e, songId) => {
    e.stopPropagation();
    setOpenMenuId(null);
    try {
      const token = tokenService.getToken();
      if (token) {
        const res = await api.removeSongFromPlaylist(token, playlist._id, songId);
        if (res.status && res.playlist) {
          setPlaylist(res.playlist);
        } else {
          console.error(res.message);
        }
      }
    } catch (err) {
      console.error('Error removing song:', err);
    }
  };

  const handleDragStart = (index) => {
    setDraggedSongIndex(index);
  };

  const handleDragEnter = (index) => {
    setDraggedOverSongIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedSongIndex(null);
    setDraggedOverSongIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, index) => {
    e.preventDefault();
    if (draggedSongIndex === null || draggedSongIndex === index) return;
    
    const newSongs = [...playlist.songs];
    const draggedItem = newSongs[draggedSongIndex];
    newSongs.splice(draggedSongIndex, 1);
    newSongs.splice(index, 0, draggedItem);
    
    // Optimistic UI update
    setPlaylist({ ...playlist, songs: newSongs });
    setDraggedSongIndex(null);
    setDraggedOverSongIndex(null);

    try {
      const token = tokenService.getToken();
      if (token) {
        await api.reorderPlaylistSongs(token, playlist._id, newSongs);
      }
    } catch (err) {
      console.error('Error reordering playlist:', err);
    }
  };

  if (loading) {
    return (
      <main className="px-container-margin py-lg max-w-[1440px] mx-auto w-full flex justify-center items-center h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </main>
    );
  }

  if (error || !playlist) {
    return (
      <main className="px-container-margin py-lg max-w-[1440px] mx-auto w-full flex justify-center items-center h-[50vh]">
        <div className="glass-panel p-8 text-center rounded-2xl border border-error/20 text-error flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl">error_outline</span>
          <p>{error || 'Playlist not found'}</p>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors">
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="px-container-margin py-lg max-w-[1440px] mx-auto w-full space-y-section-gap z-10 relative pb-32">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-[-1]"></div>
      
      {/* Playlist Header */}
      <section className="flex flex-col md:flex-row gap-8 items-end bg-gradient-to-t from-surface-container-high/40 to-transparent p-8 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
        
        <div className="w-48 h-48 md:w-60 md:h-60 shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden relative group">
          <img 
            src={playlist.songs && playlist.songs.length > 0 ? playlist.songs[0].thumbnail : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop"} 
            alt={playlist.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
        </div>

        <div className="flex-1 flex flex-col gap-2 relative z-10">
          <span className="text-label-sm font-label-sm uppercase tracking-[0.2em] text-on-surface-variant font-medium">Playlist</span>
          <h1 className="text-display-md md:text-[80px] font-display-lg font-extrabold text-on-surface tracking-tighter leading-tight drop-shadow-md">
            {playlist.name}
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            {playlist.caption || 'Created by Y-Melodies user'}
          </p>
          <div className="flex items-center gap-2 mt-2 text-label-md text-on-surface-variant">
            <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-on-primary font-bold">Y</span>
            <span className="font-medium text-on-surface">Y-Melodies</span>
            <span>•</span>
            <span>{playlist.songs?.length || 0} songs</span>
            <span>•</span>
            <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </section>

      {/* Action Bar */}
      <section className="flex items-center gap-6 px-4">
        <button 
          onClick={handlePlayAll}
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary-fixed-dim text-on-primary flex items-center justify-center shadow-[0_0_30px_rgba(161,212,148,0.4)] hover:shadow-[0_0_40px_rgba(161,212,148,0.6)] hover:scale-105 transition-all"
        >
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
        </button>
        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[32px]">favorite_border</span>
        </button>
        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[32px]">more_horiz</span>
        </button>
      </section>

      {/* Songs List */}
      <section className="mt-8">
        {playlist.songs?.length > 0 ? (
          <div className="flex flex-col">
            {/* Table Header */}
            <div className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_minmax(0,100px)_minmax(0,60px)] gap-4 px-4 py-2 text-label-md text-on-surface-variant border-b border-white/10 mb-4 sticky top-0 bg-background/80 backdrop-blur-md z-20">
              <div className="w-8 text-center">#</div>
              <div>Title</div>
              <div className="hidden md:block">Artist</div>
              <div className="text-right flex items-center justify-end"><span className="material-symbols-outlined text-[18px]">schedule</span></div>
              <div></div>
            </div>

            {/* Song Rows */}
            <div className="flex flex-col gap-1">
              {playlist.songs.map((song, index) => {
                const trackId = song._id || song.youtubeId || index;
                const isMenuOpen = openMenuId === trackId;
                
                return (
                  <div 
                    key={trackId} 
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`group grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_minmax(0,100px)_minmax(0,60px)] gap-4 items-center px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer relative ${
                      isMenuOpen ? 'z-50' : 'z-10'
                    } ${
                      draggedSongIndex === index ? 'opacity-30' : 'opacity-100'
                    } ${
                      draggedOverSongIndex === index && draggedSongIndex !== index 
                        ? draggedSongIndex < index ? 'border-b-2 border-primary bg-white/5' : 'border-t-2 border-primary bg-white/5'
                        : 'border-y-2 border-transparent hover:bg-white/5'
                    }`} 
                    onClick={() => { setCurrentTrack(song); setIsPlaying(true); }}
                  >
                    {/* Index & Play Icon */}
                    <div className="w-8 text-center text-on-surface-variant font-medium relative flex items-center justify-center">
                      <span className="group-hover:opacity-0 transition-opacity">{index + 1}</span>
                      <span className="material-symbols-outlined absolute opacity-0 group-hover:opacity-100 text-on-surface transition-opacity" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    </div>

                    {/* Title & Thumbnail */}
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-10 h-10 shrink-0 rounded bg-surface-container-high overflow-hidden shadow-md">
                        <img src={song.thumbnail || "https://images.unsplash.com/photo-1550859491-1fa1143ec40c?q=80&w=150&auto=format&fit=crop"} alt={song.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-body-md text-on-surface font-medium truncate group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: song.title }}></span>
                        <span className="text-label-sm text-on-surface-variant truncate md:hidden">{song.artist}</span>
                      </div>
                    </div>

                    {/* Artist (Desktop) */}
                    <div className="hidden md:block overflow-hidden">
                      <span className="text-body-md text-on-surface-variant truncate hover:text-on-surface transition-colors">{song.artist}</span>
                    </div>

                    {/* Duration / Options */}
                    <div className="text-right text-body-md text-on-surface-variant">
                      3:45
                    </div>
                    
                    {/* Menu Button */}
                    <div className="relative flex justify-end">
                      <button 
                        className="text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(isMenuOpen ? null : trackId); }}
                      >
                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                      </button>
                      
                      {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-surface-container-high border border-white/10 rounded-xl shadow-2xl py-2 z-50 glass-panel">
                          <button 
                            className="w-full text-left px-4 py-2 hover:bg-white/10 text-body-md text-on-surface flex items-center gap-2 transition-colors"
                            onClick={(e) => handleAddToQueue(e, song)}
                          >
                            <span className="material-symbols-outlined text-[18px]">queue_music</span>
                            Add to Queue
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 hover:bg-white/10 text-body-md text-on-surface flex items-center gap-2 transition-colors"
                            onClick={(e) => handleAddToPlaylist(e, song)}
                          >
                            <span className="material-symbols-outlined text-[18px]">playlist_add</span>
                            Add to Playlist
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 hover:bg-white/10 text-body-md text-error flex items-center gap-2 transition-colors" 
                            onClick={(e) => handleRemoveFromPlaylist(e, song._id)}
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="glass-panel p-16 text-center rounded-2xl flex flex-col items-center justify-center border border-dashed border-white/10">
            <span className="material-symbols-outlined text-6xl text-surface-variant mb-4">music_note</span>
            <h3 className="text-title-lg font-semibold text-on-surface mb-2">It's quiet in here</h3>
            <p className="text-body-md text-on-surface-variant max-w-sm mb-6">This playlist doesn't have any songs yet. Head over to Discover to find some music.</p>
            <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-medium transition-colors border border-white/10">
              Find Songs
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
