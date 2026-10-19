import { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
  MessageSquare,
  Sparkles,
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function WalkthroughMode({ projects, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(8); // seconds per slide
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);

  const currentProject = projects[currentIndex] || projects[0];
  const timerRef = useRef(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, projects.length]);

  // Audio mute sync
  const toggleMute = () => {
    soundManager.isMuted = !soundManager.isMuted;
    setIsMuted(soundManager.isMuted);
  };

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalStep = 100; // ms
    const totalSteps = (duration * 1000) / intervalStep;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextAuto();
          return 0;
        }
        return prev + 100 / totalSteps;
      });
    }, intervalStep);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration, currentIndex]);

  const handleNextAuto = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setProgress(0);
    soundManager.playSlideTransition();
  };

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    soundManager.playSlideTransition();
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    soundManager.playSlideTransition();
  };

  const handleSelectIndex = (idx) => {
    setProgress(0);
    setCurrentIndex(idx);
    soundManager.playSlideTransition();
  };

  return (
    <div className="walkthrough-overlay">
      {/* Top Walkthrough Bar */}
      <header className="walkthrough-header">
        <div className="walkthrough-branding">
          <div className="live-indicator">
            <span className="live-dot pulse" />
            <span className="live-label">CLASS PRESENTATION MODE</span>
          </div>
          <span className="walkthrough-step-counter">
            Project {currentIndex + 1} of {projects.length}
          </span>
        </div>

        {/* Global Slide Progress Bar */}
        <div className="walkthrough-progress-track">
          <div
            className="walkthrough-progress-bar"
            style={{
              width: `${progress}%`,
              background: currentProject.colorAccent
            }}
          />
        </div>

        <div className="walkthrough-top-actions">
          <button
            className={`tool-btn ${showNotes ? 'active' : ''}`}
            onClick={() => setShowNotes(!showNotes)}
            title="Toggle Presenter Talking Notes"
          >
            <MessageSquare size={16} />
            <span className="btn-label">Speaker Notes</span>
          </button>

          <button
            className="tool-btn"
            onClick={toggleMute}
            title={isMuted ? 'Unmute chimes' : 'Mute chimes'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button className="tool-btn close-btn" onClick={onClose} title="Exit Walkthrough (Esc)">
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Main Slide Content */}
      <main className="walkthrough-stage">
        <div className="stage-grid">
          {/* Visual Showcase Side */}
          <div className="stage-visual-container">
            <div
              className="stage-visual-card"
              style={{
                boxShadow: `0 20px 60px -15px ${currentProject.colorAccent}40`
              }}
            >
              <img
                src={currentProject.image}
                alt={currentProject.title}
                className="stage-img zoom-animation"
                key={currentProject.id}
              />
              <div className="stage-image-overlay" />
              
              <div className="stage-badge-group">
                <span className="stage-badge" style={{ borderColor: currentProject.colorAccent }}>
                  {currentProject.category}
                </span>
                <span className="stage-year">{currentProject.year}</span>
              </div>

              <div className="stage-quick-stats">
                {currentProject.stats?.map((s) => (
                  <div key={s.label} className="quick-stat-item">
                    <span className="stat-v" style={{ color: currentProject.colorAccent }}>
                      {s.value}
                    </span>
                    <span className="stat-l">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Narrative & Case Study Side */}
          <div className="stage-narrative-container">
            <div className="narrative-meta">
              <span className="narrative-accent-label" style={{ color: currentProject.colorAccent }}>
                PROJECT SPOTLIGHT
              </span>
              <h1 className="narrative-title">{currentProject.title}</h1>
              <p className="narrative-tagline">{currentProject.tagline}</p>
            </div>

            <div className="narrative-inquiry">
              <span className="inquiry-badge">Central Question</span>
              <p className="inquiry-text">“{currentProject.keyQuestions}”</p>
            </div>

            <p className="narrative-summary">{currentProject.summary}</p>

            <div className="narrative-tags">
              {currentProject.tags.map((t) => (
                <span key={t} className="narrative-tag">
                  {t}
                </span>
              ))}
            </div>

            {/* Presenter Talking Points Box */}
            {showNotes && (
              <div
                className="presenter-notes-box"
                style={{ borderLeftColor: currentProject.colorAccent }}
              >
                <div className="notes-header">
                  <Sparkles size={16} style={{ color: currentProject.colorAccent }} />
                  <h4>Class Presentation Script / Talking Points</h4>
                </div>
                <p className="notes-body">{currentProject.walkthroughScript}</p>
                <div className="notes-tip">
                  <span>💡 Tip: Emphasize your personal design decisions and what surprised you during critique!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Walkthrough Control Bar & Scrubber */}
      <footer className="walkthrough-footer">
        {/* Playback Controls */}
        <div className="playback-controls">
          <button className="ctrl-btn" onClick={handlePrev} title="Previous Project (Left Arrow)">
            <ChevronLeft size={20} />
          </button>

          <button
            className="ctrl-btn play-pause-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause auto-tour (Space)' : 'Play auto-tour (Space)'}
            style={{ background: currentProject.colorAccent }}
          >
            {isPlaying ? <Pause size={18} fill="#fff" /> : <Play size={18} fill="#fff" />}
          </button>

          <button className="ctrl-btn" onClick={handleNext} title="Next Project (Right Arrow)">
            <ChevronRight size={20} />
          </button>

          <div className="speed-selector">
            <span>Speed:</span>
            {[5, 8, 12].map((s) => (
              <button
                key={s}
                className={`speed-btn ${duration === s ? 'active' : ''}`}
                onClick={() => {
                  setDuration(s);
                  setProgress(0);
                }}
              >
                {s}s
              </button>
            ))}
          </div>
        </div>

        {/* Thumbnail Scrubber Navigation */}
        <div className="scrubber-list">
          {projects.map((p, idx) => (
            <button
              key={p.id}
              className={`scrubber-card ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => handleSelectIndex(idx)}
              style={{
                '--item-accent': p.colorAccent
              }}
            >
              <img src={p.image} alt={p.title} />
              <div className="scrubber-info">
                <span className="scrubber-index">0{idx + 1}</span>
                <span className="scrubber-title">{p.shortTitle}</span>
              </div>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
