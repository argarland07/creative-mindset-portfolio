import { useState, useEffect } from 'react';
import {
  BookOpen,
  LayoutGrid,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Compass,
  Monitor,
  Sun,
  Moon
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function StoryNavbar({
  viewMode,
  setViewMode,
  isAutoPlaying,
  setIsAutoPlaying,
  currentChapter,
  totalChapters,
  themeMode = 'auto',
  effectiveTheme = 'dark',
  onToggleTheme
}) {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [currentTime, setCurrentTime] = useState('');

  // Live Windows 10 style system clock
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
    <header className="metro-navbar">
      <div className="metro-navbar-inner">
        {/* Windows 10 Brand Section (Clickable Home) */}
        <div
          className="metro-brand-cluster clickable-brand"
          onClick={() => {
            soundManager.playClick();
            setViewMode('grid');
          }}
          title="Return to Start Screen (Home)"
        >
          {/* Windows 4-Square Flat Logo */}
          <div className="windows-metro-logo" title="Windows 10 Start">
            <span className="win-tile wt-1" />
            <span className="win-tile wt-2" />
            <span className="win-tile wt-3" />
            <span className="win-tile wt-4" />
          </div>

          <div className="metro-brand-text">
            <div className="metro-user-title">
              <span className="metro-author">ANDREW GARLAND</span>
              <span className="metro-slash">//</span>
              <span className="metro-app-name">CREATIVITY PORTFOLIO</span>
            </div>
            <span className="metro-sub-status">
              Windows 10 Modern UI • 8 Semester Chapters
            </span>
          </div>
        </div>

        {/* Windows 10 Pivot / Tab Switcher */}
        <div className="metro-pivot-bar">
          <button
            className={`metro-pivot-tab ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setViewMode('grid');
            }}
          >
            <LayoutGrid size={14} />
            <span>Start (Home)</span>
            {viewMode === 'grid' && <span className="pivot-active-bar" />}
          </button>

          <button
            className={`metro-pivot-tab ${viewMode === 'story' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playSlideTransition();
              setViewMode('story');
            }}
          >
            <BookOpen size={14} />
            <span>Story Walkthrough</span>
            {viewMode === 'story' && <span className="pivot-active-bar" />}
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

          {/* Windows 10 Theme Switcher: Auto / Light / Dark */}
          <button
            className="metro-icon-btn metro-theme-btn"
            onClick={onToggleTheme}
            title={
              themeMode === 'auto'
                ? `Theme: Automatic System Sync (${effectiveTheme.toUpperCase()}) • Click to change`
                : `Theme: ${themeMode.toUpperCase()} Mode • Click to change`
            }
          >
            {themeMode === 'auto' ? (
              <span className="theme-auto-wrap">
                <Monitor size={15} />
                <span className="theme-badge-dot" />
              </span>
            ) : themeMode === 'light' ? (
              <Sun size={15} className="text-amber" />
            ) : (
              <Moon size={15} className="text-cyan" />
            )}
          </button>

          {/* Windows 10 Digital Clock */}
          <div className="metro-system-clock" title="System Time">
            <span className="clock-time">{currentTime || '10:52 PM'}</span>
            <span className="clock-status">
              {themeMode === 'auto' ? `AUTO • ${effectiveTheme.toUpperCase()}` : themeMode.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
