import { useState, useEffect } from 'react';
import {
  BookOpen,
  LayoutGrid,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function StoryNavbar({
  viewMode,
  setViewMode,
  isAutoPlaying,
  setIsAutoPlaying,
  themeMode = 'dark',
  onToggleTheme
}) {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [currentTime, setCurrentTime] = useState('');

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCurrentTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    soundManager.isMuted = !soundManager.isMuted;
    setIsMuted(soundManager.isMuted);
    if (!soundManager.isMuted) soundManager.playClick();
  };

  return (
    <header className="metro-navbar md-navbar">
      <div className="metro-navbar-inner md-navbar-inner">
        {/* Brand Section */}
        <div
          className="metro-brand-cluster md-brand-cluster clickable-brand"
          onClick={() => {
            soundManager.playClick();
            setViewMode('grid');
          }}
          title="Return to Chapter Overview"
        >
          {/* Material Brand Icon */}
          <div className="md-brand-icon" title="Creative Mindset">
            <Sparkles size={18} className="brand-sparkle-icon" />
          </div>

          <div className="metro-brand-text md-brand-text">
            <div className="metro-user-title md-user-title">
              <span className="metro-author md-author">ANDREW GARLAND</span>
              <span className="md-dot">•</span>
              <span className="metro-app-name md-app-name">CREATIVE MINDSET</span>
            </div>
            <span className="metro-sub-status md-sub-status">
              Material Design Showcase • 8 Chapters
            </span>
          </div>
        </div>

        {/* Material 3 Segmented Pill Switcher */}
        <div className="metro-pivot-bar md-segmented-pills">
          <button
            className={`metro-pivot-tab md-pill-tab ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setViewMode('grid');
            }}
          >
            <LayoutGrid size={15} />
            <span>Chapters</span>
          </button>

          <button
            className={`metro-pivot-tab md-pill-tab ${viewMode === 'story' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playSlideTransition();
              setViewMode('story');
            }}
          >
            <BookOpen size={15} />
            <span>Walkthrough</span>
          </button>
        </div>

        {/* Right System Tray & Action Controls */}
        <div className="metro-system-tray">
          {viewMode === 'story' && (
            <button
              className={`metro-flat-btn ${isAutoPlaying ? 'accent-active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setIsAutoPlaying(!isAutoPlaying);
              }}
              title={isAutoPlaying ? 'Pause automatic walkthrough' : 'Play automatic walkthrough'}
            >
              {isAutoPlaying ? <Pause size={13} /> : <Play size={13} fill="currentColor" />}
              <span>{isAutoPlaying ? 'AUTO TOUR: ON' : 'AUTO TOUR'}</span>
            </button>
          )}

          <button
            className="metro-icon-btn"
            onClick={toggleSound}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Theme Switcher: Dark / Light */}
          <button
            className="metro-icon-btn metro-theme-btn"
            onClick={onToggleTheme}
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {themeMode === 'light' ? (
              <Sun size={15} className="text-amber" />
            ) : (
              <Moon size={15} className="text-cyan" />
            )}
          </button>

          {/* Windows 10 Digital Clock */}
          <div className="metro-system-clock" title="System Time">
            <span className="clock-time">{currentTime || '10:52 PM'}</span>
            <span className="clock-status">
              {themeMode.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
