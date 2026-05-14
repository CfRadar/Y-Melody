import React, { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { api } from '../services/api';

export default function Discover() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || 'global top 50 songs';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [openMenuId, setOpenMenuId] = useState(null);
  const { setIsPlaying, setCurrentTrack, queue, setQueue, setModalSong } = useOutletContext();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.searchYoutube(query);
        if (data && Array.isArray(data)) {
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load songs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  const handlePlay = (item) => {
    setCurrentTrack({
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      youtubeId: item.id.videoId
    });
    setIsPlaying(true);
  };

  const handleAddToQueue = (e, item) => {
    e.stopPropagation();
    const newTrack = {
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      youtubeId: item.id.videoId
    };
    if (queue) {
      setQueue([...queue, newTrack]);
    } else {
      setQueue([newTrack]);
    }
    setOpenMenuId(null);
  };

  const handleAddToPlaylist = (e, item) => {
    e.stopPropagation();
    const newTrack = {
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      youtubeId: item.id.videoId
    };
    if (setModalSong) {
      setModalSong(newTrack);
    }
    setOpenMenuId(null);
  };

  return (
    <main className="px-container-margin py-lg max-w-[1440px] mx-auto w-full space-y-section-gap z-10 relative">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none z-[-1]"></div>

      <section>
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="font-display-lg text-display-lg font-bold text-on-surface tracking-tight">
            {searchParams.get('q') ? `Results for "${query}"` : 'Trending Now'}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {searchParams.get('q') ? 'Top matches for your search' : 'Global top 50 songs'}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="glass-panel p-8 text-center rounded-2xl border border-error/20 text-error">
            <span className="material-symbols-outlined text-4xl mb-4">error_outline</span>
            <p>{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-on-surface-variant text-3xl">search_off</span>
            </div>
            <h3 className="text-xl font-semibold text-on-surface mb-2">No results found</h3>
            <p className="text-on-surface-variant">We couldn't find anything matching "{query}". Try another search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item) => {
              if (!item.id || !item.id.videoId) return null;
              
              const thumbnail = item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url;
              const isMenuOpen = openMenuId === item.id.videoId;
              
              return (
                <div 
                  key={item.id.videoId} 
                  className={`group relative rounded-2xl glass-panel flex flex-col border border-white/5 hover:border-primary/30 transition-all duration-300 hover:bg-white/5 hover:-translate-y-1 cursor-pointer ${isMenuOpen ? 'z-50' : 'z-10'}`}
                  onClick={() => handlePlay(item)}
                >
                  <div className="w-full aspect-video overflow-hidden relative rounded-t-2xl">
                    <img 
                      alt={item.snippet.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      src={thumbnail}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center relative">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body-lg text-body-lg font-semibold text-on-surface line-clamp-1 group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: item.snippet.title }}></h4>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 line-clamp-1">{item.snippet.channelTitle}</p>
                      </div>
                      <div className="relative">
                        <button 
                          className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(isMenuOpen ? null : item.id.videoId); }}
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
        )}
      </section>
    </main>
  );
}
