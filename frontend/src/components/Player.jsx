import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { api, tokenService } from '../services/api';

export default function Player({ track, setCurrentTrack, queue, setQueue }) {
  const title = track?.title || (typeof track === 'string' ? track : 'Neon Pulse');
  const artist = track?.artist || 'Unknown Artist';
  const thumbnail = track?.thumbnail || 'https://images.unsplash.com/photo-1550859491-1fa1143ec40c?q=80&w=150&auto=format&fit=crop';
  const videoId = track?.youtubeId || null;

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  
  const [repeatMode, setRepeatMode] = useState('OFF'); // 'OFF' | 'ALL' | 'ONE'
  const [shuffle, setShuffle] = useState(false);
  
  const [draggedQueueIndex, setDraggedQueueIndex] = useState(null);
  const [draggedOverQueueIndex, setDraggedOverQueueIndex] = useState(null);
  
  const playerRef = useRef(null);
  const progressInterval = useRef(null);
  
  const queueRef = useRef(queue);
  const setCurrentTrackRef = useRef(setCurrentTrack);
  const setQueueRef = useRef(setQueue);
  const repeatModeRef = useRef(repeatMode);
  const shuffleRef = useRef(shuffle);
  const trackRef = useRef(track);

  // Keep refs up to date for closures
  const playNextRefFunc = useRef(null);
  useEffect(() => {
    queueRef.current = queue;
    setCurrentTrackRef.current = setCurrentTrack;
    setQueueRef.current = setQueue;
    repeatModeRef.current = repeatMode;
    shuffleRef.current = shuffle;
    trackRef.current = track;
  }, [queue, setCurrentTrack, setQueue, repeatMode, shuffle, track]);

  // Auto-play when videoId changes and record history
  useEffect(() => {
    if (videoId) {
      setPlaying(true);
      setPlayed(0); // Reset progress on new song
      
      const token = tokenService.getToken();
      if (token) {
        api.addToHistory(token, {
          title,
          artist,
          thumbnail,
          youtubeId: videoId
        }).catch(err => console.error("Failed to add to history:", err));
      }
    }
  }, [videoId, title, artist, thumbnail]);

  // Sync playing state with YouTube player
  useEffect(() => {
    if (playerRef.current) {
      try {
        if (playing) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch (e) {
        console.error("Ignored YouTube API state sync error:", e);
      }
    }
  }, [playing]);

  // Sync volume state with YouTube player
  useEffect(() => {
    if (playerRef.current) {
      try {
        playerRef.current.setVolume(volume * 100);
      } catch (e) {}
    }
  }, [volume]);

  const playNext = (isManualSkip = false) => {
    const currentQueue = queueRef.current;
    const rMode = repeatModeRef.current;
    const isShuffled = shuffleRef.current;

    // If auto-playing the next song, and we are repeating one, just restart.
    if (!isManualSkip && rMode === 'ONE') {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
        setPlaying(true);
      }
      return;
    }

    if (currentQueue && currentQueue.length > 0) {
      let nextIndex = 0;
      if (isShuffled) {
        nextIndex = Math.floor(Math.random() * currentQueue.length);
      }
      
      const nextTrack = currentQueue[nextIndex];
      const newQueue = [...currentQueue];
      newQueue.splice(nextIndex, 1);

      if (rMode === 'ALL' && trackRef.current) {
        newQueue.push(trackRef.current);
      }

      if (setCurrentTrackRef.current) {
        setCurrentTrackRef.current(nextTrack);
      }
      if (setQueueRef.current) {
        setQueueRef.current(newQueue);
      }
    } else if (!isManualSkip && rMode === 'ALL' && trackRef.current) {
       // Auto-play next, queue is empty, repeat ALL is on -> repeat current
       if (playerRef.current) {
         playerRef.current.seekTo(0);
         playerRef.current.playVideo();
         setPlaying(true);
       }
    } else if (isManualSkip) {
       // Manual skip with no queue. If we want we could seek to 0, or just stop.
       if (playerRef.current) {
         playerRef.current.seekTo(0);
       }
    }
  };

  useEffect(() => {
    playNextRefFunc.current = playNext;
  }, [playNext]);

  // Media Session API for lock screen controls
  useEffect(() => {
    if ('mediaSession' in navigator) {
      const cleanTitle = typeof title === 'string' 
        ? title.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"') 
        : 'Unknown Title';
        
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: cleanTitle,
        artist: artist,
        artwork: [
          { src: thumbnail, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => setPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setPlaying(false));
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (playerRef.current) playerRef.current.seekTo(0);
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (playNextRefFunc.current) playNextRefFunc.current(true);
      });
    }
  }, [title, artist, thumbnail]);

  // Handle YouTube events
  const onReady = (event) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
    event.target.setVolume(volume * 100);
    if (playing) {
      event.target.playVideo();
    }
  };

  const onStateChange = (event) => {
    // 1 = PLAYING, 0 = ENDED, 2 = PAUSED
    if (event.data === 0) {
      setPlaying(false);
      clearInterval(progressInterval.current);
      playNext(false);
    } else if (event.data === 1) {
      setDuration(event.target.getDuration()); // Update duration just in case
      // Start polling for progress
      progressInterval.current = setInterval(() => {
        if (!seeking && event.target.getDuration() > 0) {
          setPlayed(event.target.getCurrentTime() / event.target.getDuration());
        }
      }, 1000);
    } else {
      // Paused or buffering
      clearInterval(progressInterval.current);
    }
  };

  const onError = (e) => {
    console.error("YouTube Player Error:", e.data);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => clearInterval(progressInterval.current);
  }, []);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    if (playerRef.current && duration > 0) {
      try {
        playerRef.current.seekTo(parseFloat(e.target.value) * duration, true);
      } catch (e) {}
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleQueueDragStart = (index) => {
    setDraggedQueueIndex(index);
  };

  const handleQueueDragEnter = (index) => {
    setDraggedOverQueueIndex(index);
  };

  const handleQueueDragEnd = () => {
    setDraggedQueueIndex(null);
    setDraggedOverQueueIndex(null);
  };

  const handleQueueDragOver = (e) => {
    e.preventDefault();
  };

  const handleQueueDrop = (e, index) => {
    e.preventDefault();
    if (draggedQueueIndex === null) return;
    const newQueue = [...queue];
    const draggedItem = newQueue[draggedQueueIndex];
    newQueue.splice(draggedQueueIndex, 1);
    newQueue.splice(index, 0, draggedItem);
    setQueue(newQueue);
    setDraggedQueueIndex(null);
    setDraggedOverQueueIndex(null);
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      origin: window.location.origin,
    },
  };

  return (
    <>
      {/* Right Sidebar (Queue & Video) */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-surface-container-low border-l border-white/10 z-40 transform transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col shadow-2xl ${isQueueOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-md border-b border-white/10 pt-safe">
          <h2 className="text-title-md font-title-md font-semibold text-on-surface">Queue & Video</h2>
          <button onClick={() => setIsQueueOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-white/5 active:scale-90">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Video Player Container */}
        <div className="w-full aspect-video bg-black relative shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          {videoId ? (
            <div className={`absolute top-0 left-0 w-full h-full ${!isQueueOpen && 'pointer-events-none opacity-0'}`}>
              <YouTube 
                videoId={videoId} 
                opts={opts} 
                onReady={onReady} 
                onStateChange={onStateChange} 
                onError={onError}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-secondary-fixed-dim">
              <span className="material-symbols-outlined text-[48px] opacity-50">music_video</span>
            </div>
          )}
        </div>

        {/* Currently Playing Info (Sidebar) */}
        <div className="p-md flex items-center gap-sm border-b border-white/5 shrink-0 bg-white/[0.02]">
          <img src={thumbnail} alt="Thumbnail" className="w-14 h-14 rounded-md object-cover shadow-lg" />
          <div className="flex-1 min-w-0">
            <p className="text-label-sm text-primary font-medium mb-0.5">Now Playing</p>
            <h4 className="text-body-lg font-semibold text-on-surface line-clamp-1" dangerouslySetInnerHTML={{ __html: title }}></h4>
            <p className="text-body-md text-on-surface-variant line-clamp-1">{artist}</p>
          </div>
        </div>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto p-md pb-32 custom-scrollbar">
          <h3 className="text-title-sm font-semibold text-on-surface mb-sm flex items-center justify-between">
            Up Next
            <span className="text-label-sm text-secondary-fixed-dim font-normal">{queue?.length || 0} songs</span>
          </h3>
          
          {queue && queue.length > 0 ? (
            <div className="flex flex-col gap-2">
              {queue.map((song, index) => (
                <div 
                  key={index} 
                  draggable
                  onDragStart={() => handleQueueDragStart(index)}
                  onDragEnter={() => handleQueueDragEnter(index)}
                  onDragEnd={handleQueueDragEnd}
                  onDragOver={handleQueueDragOver}
                  onDrop={(e) => handleQueueDrop(e, index)}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all group cursor-pointer border-2 ${
                    draggedQueueIndex === index ? 'opacity-30' : 'opacity-100'
                  } ${
                    draggedOverQueueIndex === index && draggedQueueIndex !== index ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-white/5'
                  }`} 
                  onClick={() => { setCurrentTrack(song); setQueue(queue.filter((_, i) => i !== index)); }}
                >
                  <div className="w-10 h-10 shrink-0 relative rounded overflow-hidden">
                    <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md text-on-surface font-medium line-clamp-1 group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: song.title }}></p>
                    <p className="text-label-sm text-on-surface-variant line-clamp-1">{song.artist}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setQueue(queue.filter((_, i) => i !== index)); }} className="text-on-surface-variant hover:text-error transition-colors p-1">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                    <div className="text-on-surface-variant cursor-grab active:cursor-grabbing p-1 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <span className="material-symbols-outlined text-[32px] text-surface-variant mb-2">queue_music</span>
              <p className="text-body-md text-secondary-fixed-dim">Your queue is empty</p>
              <p className="text-label-sm text-surface-variant mt-1">Play songs from Discover or your Playlists to add them here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Toggle Button (visible when sidebar is closed) */}
      <button 
        onClick={() => setIsQueueOpen(true)}
        className={`fixed top-1/2 -translate-y-1/2 right-0 z-30 bg-surface-container-high/80 backdrop-blur-md p-2 rounded-l-xl border border-r-0 border-white/10 shadow-lg hover:pr-4 hover:bg-primary-container hover:text-on-primary-container transition-all duration-300 ${isQueueOpen ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
      >
        <span className="material-symbols-outlined text-[24px]">keyboard_double_arrow_left</span>
      </button>

      {/* Persistent Bottom Music Player Dock (Desktop & Tablet) */}
      <div className="hidden md:flex fixed bottom-md left-1/2 -translate-x-1/2 w-[600px] lg:w-[800px] glass-panel rounded-full px-sm py-2 z-50 items-center justify-between shadow-2xl border border-white/10 backdrop-blur-[64px]">
        {/* Track Info */}
        <div className="flex items-center gap-sm w-1/3">
          <img alt="Currently Playing" className={`w-12 h-12 rounded-full object-cover border border-white/10 ${playing ? 'animate-[spin_10s_linear_infinite]' : ''}`} src={thumbnail}/>
          <div className="hidden sm:block pr-2">
            <h5 className="text-body-md font-body-md text-on-surface font-semibold line-clamp-1" dangerouslySetInnerHTML={{ __html: title }}></h5>
            <p className="text-label-sm font-label-sm text-secondary-fixed-dim line-clamp-1">{artist}</p>
          </div>
        </div>

        {/* Controls & Progress */}
        <div className="flex flex-col items-center justify-center w-1/3 sm:w-1/2 gap-1">
          <div className="flex items-center gap-xs sm:gap-md text-on-surface">
            <button 
              onClick={() => setShuffle(!shuffle)}
              className={`transition-colors hidden sm:block ${shuffle ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              <span className="material-symbols-outlined text-[20px]">shuffle</span>
            </button>
            <button onClick={() => { if (playerRef.current) playerRef.current.seekTo(0); }} className="text-on-surface hover:text-primary transition-colors"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>skip_previous</span></button>
            <button 
              onClick={handlePlayPause}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center hover:scale-105 transition-transform glow-active"
            >
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {playing ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button onClick={() => playNext(true)} className="text-on-surface hover:text-primary transition-colors"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>skip_next</span></button>
            <button 
              onClick={() => setRepeatMode(prev => prev === 'OFF' ? 'ALL' : prev === 'ALL' ? 'ONE' : 'OFF')}
              className={`transition-colors hidden sm:block ${repeatMode !== 'OFF' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              <span className="material-symbols-outlined text-[20px]">{repeatMode === 'ONE' ? 'repeat_one' : 'repeat'}</span>
            </button>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 w-full max-w-xs text-[10px] text-on-surface-variant">
            <span>{formatTime(played * duration)}</span>
            <div className="flex-1 relative h-1.5 flex items-center">
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={played}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full h-full bg-surface-container-highest rounded-full overflow-hidden absolute">
                <div 
                  className="h-full bg-tertiary-fixed-dim rounded-full" 
                  style={{ width: `${played * 100}%` }}
                ></div>
              </div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Extras */}
        <div className="flex items-center justify-end gap-sm w-1/3 text-on-surface-variant">
          <button 
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className={`transition-colors hidden lg:block p-2 rounded-full hover:bg-white/5 active:scale-90 ${isQueueOpen ? 'text-primary bg-primary/10' : 'hover:text-primary'}`}
          >
            <span className="material-symbols-outlined text-[20px]">queue_music</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 w-24 ml-2">
            <span className="material-symbols-outlined text-[18px]">
              {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
            </span>
            <div className="flex-1 relative h-1 flex items-center">
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={volume}
                onChange={handleVolumeChange}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full h-full bg-surface-container-highest rounded-full overflow-hidden absolute">
                <div 
                  className="h-full bg-primary-fixed rounded-full" 
                  style={{ width: `${volume * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full h-24 flex justify-around items-center px-lg pb-safe bg-surface-container-high/80 backdrop-blur-3xl text-tertiary font-label-sm text-label-sm z-50 rounded-t-xl border-t border-white/10 shadow-2xl">
        <a className="flex flex-col items-center gap-1 text-tertiary shadow-[0_0_20px_rgba(104,211,255,0.2)] hover:text-primary transition-all duration-300 active:scale-90" href="#" onClick={(e) => { e.preventDefault(); handlePlayPause(); }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{playing ? 'pause_circle' : 'play_circle'}</span>
          {playing ? 'Pause' : 'Play'}
        </a>
        <a className={`flex flex-col items-center gap-1 transition-all duration-300 active:scale-90 ${isQueueOpen ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} href="#" onClick={(e) => { e.preventDefault(); setIsQueueOpen(!isQueueOpen); }}>
          <span className="material-symbols-outlined">queue_music</span>
          Queue
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-all duration-300 active:scale-90" href="#">
          <span className="material-symbols-outlined">speaker_group</span>
          Devices
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-all duration-300 active:scale-90" href="#">
          <span className="material-symbols-outlined">mic_external_on</span>
          Lyrics
        </a>
      </nav>
    </>
  );
}
