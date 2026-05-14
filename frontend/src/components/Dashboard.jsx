import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { api, tokenService, userService } from '../services/api';

export default function Dashboard() {
  const [user, setUser] = useState(userService.getUser());
  const [playlists, setPlaylists] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const { setIsPlaying, setCurrentTrack, queue, setQueue, setModalSong } = useOutletContext();

  useEffect(() => {
    const loadData = async () => {
      const token = tokenService.getToken();
      if (!token) return;
      
      try {
        const [profileRes, playlistsRes] = await Promise.all([
          api.getProfile(token),
          api.getPlaylists(token)
        ]);
        
        if (profileRes.status) setUser(profileRes.user);
        if (playlistsRes.status) setPlaylists(playlistsRes.playlists || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    loadData();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  const handleAddToQueue = (e, item) => {
    e.stopPropagation();
    if (queue) {
      setQueue([...queue, item]);
    } else {
      setQueue([item]);
    }
    setOpenMenuId(null);
  };

  const handleAddToPlaylist = (e, item) => {
    e.stopPropagation();
    if (setModalSong) {
      setModalSong(item);
    }
    setOpenMenuId(null);
  };

  const [isMorningDewLoading, setIsMorningDewLoading] = useState(false);

  const handleMorningDewPlay = async () => {
    if (isMorningDewLoading) return;
    setIsMorningDewLoading(true);
    try {
      const data = await api.searchYoutube('Nature Sound');
      if (data && Array.isArray(data) && data.length > 0) {
        const tracks = data.map(item => ({
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
          youtubeId: item.id.videoId
        }));
        
        setCurrentTrack(tracks[0]);
        setIsPlaying(true);
        setQueue(tracks.slice(1));
      }
    } catch (err) {
      console.error('Error fetching Morning Dew playlist:', err);
    } finally {
      setIsMorningDewLoading(false);
    }
  };

  const history = user?.history || [];
  
  // Group history by date...
  const groupedHistory = history.reduce((acc, track) => {
    const dateStr = track.playedAt ? new Date(track.playedAt).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : 'Recently Played';
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(track);
    return acc;
  }, {});

  return (
    <main className="px-container-margin py-lg max-w-[1440px] mx-auto w-full space-y-section-gap z-10 relative">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none z-[-1]"></div>

      {/* Hero Section */}
      <section 
        className="relative overflow-hidden rounded-[32px] glass-panel border border-white/10 p-8 md:p-12 lg:p-16"
        style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(19, 19, 19, 0.9) 0%, rgba(19, 19, 19, 0.4) 100%), url(/download.jpg)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-widest mb-6">Featured Mix</span>
          <h2 className="font-display-lg text-display-lg md:text-[64px] font-extrabold text-on-surface leading-tight tracking-tight mb-4 drop-shadow-md">
            Morning Dew
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg leading-relaxed">
            Start your day with soft, organic sounds. Acoustic guitars, gentle synths, and field recordings.
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleMorningDewPlay} 
              disabled={isMorningDewLoading}
              className="px-8 py-4 rounded-full bg-primary hover:bg-primary-fixed-dim text-on-primary font-label-lg text-label-lg font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(161,212,148,0.4)] hover:shadow-[0_0_40px_rgba(161,212,148,0.6)] transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isMorningDewLoading ? (
                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              )}
              {isMorningDewLoading ? 'Loading...' : 'Play Now'}
            </button>
            <button className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-on-surface hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">favorite_border</span>
            </button>
          </div>
        </div>
      </section>

      {/* Recently Played grid based on playlists */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Your Library</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Jump back in</p>
          </div>
          <button className="font-label-lg text-label-lg text-primary hover:text-primary-fixed-dim transition-colors uppercase tracking-widest flex items-center gap-1 group">
            View All
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map(playlist => {
            const coverImage = playlist.songs && playlist.songs.length > 0 ? playlist.songs[0].thumbnail : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop";
            return (
            <Link to={`/playlist/${playlist._id}`} key={playlist._id} className="group relative overflow-hidden rounded-2xl glass-panel p-4 flex gap-4 items-center border border-white/5 hover:border-primary/30 transition-all duration-300 hover:bg-white/5 hover:-translate-y-1">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-lg relative">
                <img alt="Playlist Art" className="w-full h-full object-cover" src={coverImage}/>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </div>
              </div>
              <div className="flex flex-col overflow-hidden">
                <h4 className="font-label-lg text-label-lg font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{playlist.name}</h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant truncate">By Y-Melodies</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(104,211,255,0.8)]"></span>
                  <span className="font-label-sm text-[10px] text-tertiary tracking-wider uppercase">Active</span>
                </div>
              </div>
            </Link>
          );
        })}
          {playlists.length === 0 && (
             <div className="col-span-full p-8 text-center text-on-surface-variant border border-dashed border-white/20 rounded-2xl">
               No playlists found. Create one to get started!
             </div>
          )}
        </div>
      </section>

      {/* Listening History */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="text-headline-sm font-display-sm font-bold text-on-surface mb-2">Listening History</h3>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">Your recently played organic sounds.</p>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedHistory).map(([date, tracks]) => (
              <div key={date}>
                <h4 className="text-title-md font-semibold text-on-surface-variant mb-4 pl-2 border-l-2 border-primary/50">{date}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {tracks.map((item, index) => {
                    const trackId = item._id || item.youtubeId || index;
                    const isMenuOpen = openMenuId === trackId;
                    return (
                      <div key={trackId} className={`group relative rounded-2xl glass-panel p-4 flex gap-4 items-center border border-white/5 hover:border-primary/30 transition-all duration-300 hover:bg-white/5 hover:-translate-y-1 cursor-pointer ${isMenuOpen ? 'z-50' : 'z-10'}`} onClick={() => { setCurrentTrack(item); setIsPlaying(true); }}>
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-lg relative">
                          <img alt="Track Art" className="w-full h-full object-cover" src={item.thumbnail || "https://images.unsplash.com/photo-1550859491-1fa1143ec40c?q=80&w=150&auto=format&fit=crop"}/>
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 relative">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <h5 className="text-body-lg font-semibold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h5>
                              <p className="text-body-md text-on-surface-variant mt-0.5 line-clamp-1">{item.artist}</p>
                            </div>
                            <div className="relative shrink-0">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(isMenuOpen ? null : trackId); }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-white/10 text-on-surface-variant hover:text-on-surface transition-all"
                              >
                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                              </button>
                              
                              {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-surface-container-high border border-white/10 rounded-xl shadow-2xl py-2 z-50 glass-panel">
                                  <button 
                                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-body-md text-on-surface flex items-center gap-2 transition-colors"
                                    onClick={(e) => handleAddToQueue(e, item)}
                                  >
                                    <span className="material-symbols-outlined text-[18px]">queue_music</span>
                                    Add to Queue
                                  </button>
                                  <button 
                                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-body-md text-on-surface flex items-center gap-2 transition-colors"
                                    onClick={(e) => handleAddToPlaylist(e, item)}
                                  >
                                    <span className="material-symbols-outlined text-[18px]">playlist_add</span>
                                    Add to Playlist
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-on-surface-variant border border-dashed border-white/20 rounded-2xl mt-8">
            No listening history yet.
          </div>
        )}
      </section>

    </main>
  );
}
