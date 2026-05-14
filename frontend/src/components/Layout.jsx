import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Player from './Player';
import NotificationCenter from './NotificationCenter';
import AddToPlaylistModal from './AddToPlaylistModal';

export default function Layout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [modalSong, setModalSong] = useState(null);

  return (
    <div className="bg-background text-on-surface font-body-lg min-h-screen overflow-hidden flex">
      {/* OVERLAY BACKGROUND WRAPPER */}
      <div className={`flex w-full h-screen transition-all duration-700 ease-out ${showNotifications ? 'blur-[8px] brightness-[0.6] scale-[0.98]' : ''}`}>
        <Sidebar />
        
        <div className="flex-grow md:ml-64 flex flex-col min-h-screen relative h-screen overflow-y-auto pb-32">
          <TopBar onToggleNotifications={() => setShowNotifications(true)} />
          <Outlet context={{ isPlaying, setIsPlaying, currentTrack, setCurrentTrack, queue, setQueue, setModalSong }} />
        </div>
      </div>
      {isPlaying && <Player track={currentTrack} setCurrentTrack={setCurrentTrack} queue={queue} setQueue={setQueue} />}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      <AddToPlaylistModal 
        isOpen={!!modalSong} 
        onClose={() => setModalSong(null)} 
        song={modalSong} 
      />
    </div>
  );
}
