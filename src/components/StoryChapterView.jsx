import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
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
  Users
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
  autoPlayProgress
}) {
  const current = topics[currentIndex] || topics[0];
  const [showFullImage, setShowFullImage] = useState(false);
  
  // Game mode map per chapter (defaults to 'game' for gamified chapters)
  const [chapterModes, setChapterModes] = useState({
    'first-day': 'game',
    'mentor-interview': 'game',
    'rube-goldberg': 'game',
    'night-photos': 'game',
    'social-curiosity': 'game'
  });

  const isChapter1 = current.id === 'first-day';
  const isChapter3 = current.id === 'mentor-interview';
  const isChapter4 = current.id === 'rube-goldberg';
  const isChapter5 = current.id === 'night-photos';
  const isChapter6 = current.id === 'social-curiosity';
  const hasGame = isChapter1 || isChapter3 || isChapter4 || isChapter5 || isChapter6;
  const currentMode = chapterModes[current.id] || 'story';

  const setModeForCurrent = (newMode) => {
    setChapterModes((prev) => ({ ...prev, [current.id]: newMode }));
  };

  return (
    <div className="story-container">
      {/* Top Chapter Progress Stepper Bar */}
      <nav className="chapter-stepper-bar" aria-label="Chapter Stepper">
        <div className="stepper-track">
          {topics.map((t, idx) => {
            const isActive = idx === currentIndex;
            const isCompleted = idx < currentIndex;
            return (
              <button
                key={t.id}
                className={`stepper-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                  soundManager.playSlideTransition();
                  onSelectIndex(idx);
                }}
                style={{ '--step-accent': t.accentColor }}
                title={`Jump to Chapter ${idx + 1}: ${t.title}`}
              >
                <span className="step-circle">{idx + 1}</span>
                <span className="step-text">{t.title}</span>
                {t.id === 'first-day' && <span className="game-micro-tag">RPG</span>}
                {t.id === 'mentor-interview' && <span className="game-micro-tag zoom-tag">ZOOM</span>}
                {t.id === 'rube-goldberg' && <span className="game-micro-tag domino-tag">CHAIN</span>}
                {t.id === 'night-photos' && <span className="game-micro-tag darkroom-tag">LENS</span>}
                {t.id === 'social-curiosity' && <span className="game-micro-tag comfort-tag">NPC</span>}
              </button>
            );
          })}
        </div>
      </nav>

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

        {/* Mode Toggle Header for Gamified Chapters */}
        {hasGame && (
          <div className="chapter-mode-header">
            <div className="mode-toggle-pill">
              <button
                className={`mode-btn ${currentMode === 'game' ? 'active' : ''}`}
                onClick={() => {
                  soundManager.playClick();
                  setModeForCurrent('game');
                }}
              >
                {isChapter1 && <Gamepad2 size={16} />}
                {isChapter3 && <Video size={16} />}
                {isChapter4 && <Wrench size={16} />}
                {isChapter5 && <Camera size={16} />}
                {isChapter6 && <Users size={16} />}
                <span>
                  {isChapter1 && 'RPG Character Creation Game'}
                  {isChapter3 && 'The Wisdom Network (Zoom Dialogue)'}
                  {isChapter4 && 'Chain-Reaction Engine (Physics Game)'}
                  {isChapter5 && 'The Viewfinder: Flashlight Lens Game'}
                  {isChapter6 && 'Comfort Zone Simulator (NPC Map)'}
                </span>
              </button>
              <button
                className={`mode-btn ${currentMode === 'story' ? 'active' : ''}`}
                onClick={() => {
                  soundManager.playClick();
                  setModeForCurrent('story');
                }}
              >
                <BookOpen size={16} />
                <span>Narrative Story View</span>
              </button>
            </div>
          </div>
        )}

        {/* Gamified View vs Standard Story Layout */}
        {isChapter1 && currentMode === 'game' ? (
          <Chapter1CharacterCreation
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
          />
        ) : isChapter3 && currentMode === 'game' ? (
          <Chapter3MentorInterview
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
          />
        ) : isChapter4 && currentMode === 'game' ? (
          <Chapter4RubeGoldberg
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
          />
        ) : isChapter5 && currentMode === 'game' ? (
          <Chapter5FlashlightLens
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
          />
        ) : isChapter6 && currentMode === 'game' ? (
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
