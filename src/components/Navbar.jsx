import { useState } from 'react';
import { Play, Plus, Volume2, VolumeX, Sparkles, Layers } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function Navbar({ onStartWalkthrough, onOpenEditor, projectCount }) {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);

  const toggleSound = () => {
    soundManager.isMuted = !soundManager.isMuted;
    setIsMuted(soundManager.isMuted);
    if (!soundManager.isMuted) {
      soundManager.playClick();
    }
  };

  return (
    <header className="navbar-root">
      <div className="navbar-container">
        {/* Brand / Title */}
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <Sparkles size={18} className="brand-sparkle" />
          </div>
          <div className="brand-text">
            <span className="brand-title">CREATIVITY PORTFOLIO</span>
            <span className="brand-subtitle">Class Walkthrough Edition • Fall 2026</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          <button
            className="nav-icon-btn"
            onClick={toggleSound}
            title={isMuted ? 'Turn Sound On' : 'Mute Ambient Chimes'}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} className="pulse-text" />}
            <span className="btn-text">{isMuted ? 'Sound Off' : 'Ambient On'}</span>
          </button>

          <button
            className="nav-secondary-btn"
            onClick={() => {
              soundManager.playClick();
              onOpenEditor();
            }}
          >
            <Plus size={16} />
            <span>Add Work</span>
          </button>

          <button
            className="nav-primary-btn"
            onClick={() => {
              soundManager.playClick();
              onStartWalkthrough(0);
            }}
          >
            <Play size={15} fill="currentColor" />
            <span>Start Walkthrough</span>
            <span className="project-badge">{projectCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
