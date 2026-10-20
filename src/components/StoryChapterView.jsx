import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Edit3,
  Quote,
  CheckCircle2,
  Calendar,
  Maximize2,
  Gamepad2,
  BookOpen,
  Video,
  Wrench,
  Camera,
  Users,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Monitor
} from 'lucide-react';
import Chapter1CharacterCreation from './games/Chapter1CharacterCreation';
import Chapter3MentorInterview from './games/Chapter3MentorInterview';
import Chapter4RubeGoldberg from './games/Chapter4RubeGoldberg';
import Chapter5FlashlightLens from './games/Chapter5FlashlightLens';
import Chapter6ComfortZone from './games/Chapter6ComfortZone';
import { soundManager } from '../utils/audio';

export default function StoryChapterView({
  topics,
  currentIndex,
  onSelectIndex,
  onNext,
  onPrev,
  onOpenEditModal,
  onUpdateTopicData,
  isAutoPlaying,
  setIsAutoPlaying,
  autoPlayProgress,
  onBackToStart,
  themeMode,
  onToggleTheme
}) {
  const current = topics[currentIndex] || topics[0];
  const [showFullImage, setShowFullImage] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);

  const toggleSound = () => {
    soundManager.isMuted = !soundManager.isMuted;
    setIsMuted(soundManager.isMuted);
    if (!soundManager.isMuted) soundManager.playClick();
  };
  
  const isChapter1 = current.id === 'first-day';
  const isChapter3 = current.id === 'mentor-interview';
  const isChapter4 = current.id === 'rube-goldberg';
  const isChapter5 = current.id === 'night-photos';
  const isChapter6 = current.id === 'social-curiosity';
  const hasGame = isChapter1 || isChapter3 || isChapter4 || isChapter5 || isChapter6;

  return (
    <div className="story-container">
      {/* Subtle Minimal Top Action Bar */}
      <header className="story-top-minimal-bar">
        <button
          className="story-back-btn"
          onClick={() => {
            soundManager.playClick();
            if (onBackToStart) onBackToStart();
          }}
          title="Return to Start Screen (Home)"
        >
          <ArrowLeft size={16} />
          <span>Back to Start</span>
        </button>

        <div className="story-minimal-breadcrumb">
          <span className="crumb-badge" style={{ backgroundColor: current.accentColor }}>
            Chapter {currentIndex + 1} of {topics.length}
          </span>
          <span className="crumb-title">{current.title}</span>
        </div>

        <div className="story-minimal-tray">
          {setIsAutoPlaying && (
            <button
              className={`story-tray-btn ${isAutoPlaying ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setIsAutoPlaying(!isAutoPlaying);
              }}
              title={isAutoPlaying ? 'Pause Auto Tour' : 'Start Auto Tour (Spacebar)'}
            >
              {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span className="tray-label">{isAutoPlaying ? 'Pause' : 'Tour'}</span>
            </button>
          )}

          <button
            className="story-tray-btn"
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {onToggleTheme && (
            <button
              className="story-tray-btn"
              onClick={onToggleTheme}
              title={`Toggle Theme Mode (Current: ${themeMode})`}
            >
              <Monitor size={15} />
            </button>
          )}
        </div>
      </header>

      {/* Main Single Topic Story Card */}
      <article
        className="chapter-card"
        style={{ '--chapter-color': current.accentColor }}
      >
        {/* Subtle Accent Glow Header Line */}
        <div
          className="chapter-accent-line"
          style={{ background: current.accentColor }}
        />

        {/* Gamified View vs Standard Story Layout */}
        {isChapter1 ? (
          <Chapter1CharacterCreation
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
          />
        ) : isChapter3 ? (
          <Chapter3MentorInterview
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
          />
        ) : isChapter4 ? (
          <Chapter4RubeGoldberg
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
          />
        ) : isChapter5 ? (
          <Chapter5FlashlightLens
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
          />
        ) : isChapter6 ? (
          <Chapter6ComfortZone
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
          />
        ) : (
          /* Standard Story Layout Grid */
          <div className="chapter-layout-grid">
            {/* Left Column: Visual Media Showcase */}
            <div className="chapter-media-column">
              <div
                className="chapter-image-frame"
                onClick={() => setShowFullImage(true)}
                title="Click to view full photo"
              >
                <img
                  src={current.image}
                  alt={current.title}
                  className="chapter-img"
                  key={current.id}
                />
                <div className="chapter-img-overlay" />
                
                <div className="chapter-badge">
                  <span>{current.phase}</span>
                </div>

                <div className="expand-indicator">
                  <Maximize2 size={14} />
                  <span>View Full Photo</span>
                </div>
              </div>

              {/* Quick Tags under Image */}
              <div className="chapter-tags-row">
                {current.tags?.map((tag) => (
                  <span key={tag} className="chapter-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Narrative Story & Reflections */}
            <div className="chapter-text-column">
              {/* Phase & Counter */}
              <div className="chapter-meta-row">
                <span
                  className="chapter-number-pill"
                  style={{
                    color: current.accentColor,
                    borderColor: `${current.accentColor}40`,
                    background: `${current.accentColor}15`
                  }}
                >
                  CHAPTER {currentIndex + 1} OF {topics.length}
                </span>

                <button
                  className="edit-notes-btn"
                  onClick={() => {
                    soundManager.playClick();
                    onOpenEditModal(current);
                  }}
                  title="Edit your reflection or notes for this topic"
                >
                  <Edit3 size={14} />
                  <span>Edit My Notes</span>
                </button>
              </div>

              {/* Main Title & Subtitle */}
              <h1 className="chapter-main-title">{current.title}</h1>
              <p className="chapter-subtitle">{current.subtitle}</p>

              {/* Narrative Story */}
              <div className="story-paragraph-box">
                <p className="story-text">{current.story}</p>
              </div>

              {/* Key Takeaway Callout */}
              <div
                className="key-takeaway-card"
                style={{ borderLeftColor: current.accentColor }}
              >
                <div className="takeaway-header">
                  <Quote size={15} style={{ color: current.accentColor }} />
                  <span>Key Creative Takeaway</span>
                </div>
                <p className="takeaway-quote">“{current.keyTakeaway}”</p>
              </div>

              {/* Personal Reflection Card */}
              <div className="personal-reflection-card">
                <div className="reflection-header">
                  <Sparkles size={15} style={{ color: '#fbbf24' }} />
                  <span>Personal Reflection & Growth</span>
                </div>
                <p className="reflection-text">{current.reflection}</p>
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Bottom Sticky Chapter Controller */}
      <footer className="story-footer-controls">
        <div className="footer-controls-inner">
          {/* Previous Button */}
          <button
            className="story-nav-btn prev-btn"
            onClick={onPrev}
            disabled={currentIndex === 0}
            title="Previous Topic (Left Arrow)"
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>

          {/* Center Progress Pager & Numbers */}
          <div className="pager-center-group">
            {isAutoPlaying && (
              <div className="auto-progress-wrapper">
                <div
                  className="auto-progress-bar"
                  style={{
                    width: `${autoPlayProgress}%`,
                    background: current.accentColor
                  }}
                />
              </div>
            )}

            <div className="quick-number-links">
              {topics.map((_, idx) => (
                <button
                  key={idx}
                  className={`num-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => {
                    soundManager.playSlideTransition();
                    onSelectIndex(idx);
                  }}
                  style={{
                    borderColor: idx === currentIndex ? current.accentColor : 'transparent'
                  }}
                  title={`Topic ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            className="story-nav-btn next-btn"
            onClick={onNext}
            style={{
              background: `linear-gradient(135deg, ${current.accentColor}, #6366f1)`,
              boxShadow: `0 0 20px -3px ${current.accentColor}60`
            }}
            title={currentIndex === topics.length - 1 ? 'Start Over' : 'Next Topic (Right Arrow)'}
          >
            <span>{currentIndex === topics.length - 1 ? 'Restart Story' : 'Next Chapter'}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </footer>

      {/* Fullscreen Photo Lightbox Modal */}
      {showFullImage && (
        <div className="lightbox-backdrop" onClick={() => setShowFullImage(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={current.image} alt={current.title} />
            <div className="lightbox-caption">
              <h4>{current.title}</h4>
              <p>{current.subtitle}</p>
              <button
                className="lightbox-close"
                onClick={() => setShowFullImage(false)}
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
