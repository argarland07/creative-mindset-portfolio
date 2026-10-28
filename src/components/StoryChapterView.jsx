import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Edit3,
  Quote,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Monitor,
  Settings,
  Lock,
  Unlock,
  Check,
  X,
  RotateCcw
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
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Native Browser Fullscreen tracking
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(() => {
    if (typeof document !== 'undefined') {
      return Boolean(document.fullscreenElement);
    }
    return false;
  });

  useEffect(() => {
    const handleFsChange = () => {
      setIsBrowserFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleBrowserFullscreen = async () => {
    try {
      soundManager.playClick();
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  };

  // Section completion gating
  const [completedSections, setCompletedSections] = useState(() => {
    try {
      const saved = localStorage.getItem('creativity_completed_sections');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleCompleteSection = (topicId) => {
    setCompletedSections((prev) => {
      if (prev.includes(topicId)) return prev;
      const next = [...prev, topicId];
      try {
        localStorage.setItem('creativity_completed_sections', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Setting: "Show next page button always" (persistent in localStorage)
  const [alwaysShowNext, setAlwaysShowNext] = useState(() => {
    try {
      return localStorage.getItem('creativity_always_show_next') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleAlwaysShowNext = (forcedVal) => {
    const val = typeof forcedVal === 'boolean' ? forcedVal : !alwaysShowNext;
    setAlwaysShowNext(val);
    try {
      localStorage.setItem('creativity_always_show_next', String(val));
    } catch {
      // Ignore
    }
    soundManager.playClick();
  };

  const handleResetProgress = () => {
    setCompletedSections([]);
    try {
      localStorage.removeItem('creativity_completed_sections');
    } catch {
      // Ignore
    }
    soundManager.playClick();
  };

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

  // Chapter 1 multi-step phase ('attributes' | 'reflection')
  const [chapter1Phase, setChapter1Phase] = useState('attributes');
  const [isChapter1Transitioning, setIsChapter1Transitioning] = useState(false);

  useEffect(() => {
    if (!isChapter1) {
      setChapter1Phase('attributes');
      setIsChapter1Transitioning(false);
    }
  }, [isChapter1]);

  const handleChapter1Next = () => {
    if (isChapter1Transitioning) return;
    setIsChapter1Transitioning(true);
    soundManager.playLevelUp();
    setTimeout(() => {
      setChapter1Phase('reflection');
      setIsChapter1Transitioning(false);
      handleCompleteSection(current.id);
    }, 380);
  };

  const handleChapter1Prev = () => {
    if (isChapter1Transitioning) return;
    setIsChapter1Transitioning(true);
    soundManager.playSlideTransition();
    setTimeout(() => {
      setChapter1Phase('attributes');
      setIsChapter1Transitioning(false);
    }, 300);
  };

  // Intercept ArrowRight / ArrowLeft in Chapter 1 so right arrow triggers reflection first
  useEffect(() => {
    if (!isChapter1) return;
    const handleChapter1Key = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' && chapter1Phase === 'attributes') {
        e.stopPropagation();
        handleChapter1Next();
      } else if (e.key === 'ArrowLeft' && chapter1Phase === 'reflection') {
        e.stopPropagation();
        handleChapter1Prev();
      }
    };
    window.addEventListener('keydown', handleChapter1Key, true);
    return () => window.removeEventListener('keydown', handleChapter1Key, true);
  }, [isChapter1, chapter1Phase, isChapter1Transitioning]);

  const isCurrentCompleted = completedSections.includes(current.id);
  const canAdvance = alwaysShowNext || isCurrentCompleted || isChapter1;

  return (
    <div className="story-container story-fullscreen-view">
      {/* Floating Minimal Top-Left Back / Exit Action */}
      <button
        className="hud-floating-btn hud-exit-btn"
        onClick={() => {
          soundManager.playClick();
          if (onBackToStart) onBackToStart();
        }}
        title="Exit Full Screen View & Return to Overview (Home)"
      >
        <ArrowLeft size={16} />
        <span className="hud-exit-label">Home</span>
      </button>

      {/* Floating Minimal Top-Right HUD Controls Cluster */}
      <aside className="hud-floating-cluster" aria-label="Story View Controls">
        {setIsAutoPlaying && (
          <button
            className={`hud-icon-btn ${isAutoPlaying ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setIsAutoPlaying(!isAutoPlaying);
            }}
            title={isAutoPlaying ? 'Pause Auto Tour' : 'Start Auto Tour (Spacebar)'}
          >
            {isAutoPlaying ? <Pause size={15} /> : <Play size={15} />}
            <span className="hud-btn-text">{isAutoPlaying ? 'Pause' : 'Tour'}</span>
          </button>
        )}

        <button
          className="hud-icon-btn"
          onClick={toggleSound}
          title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        {onToggleTheme && (
          <button
            className="hud-icon-btn"
            onClick={onToggleTheme}
            title={`Toggle Theme Mode (Current: ${themeMode})`}
          >
            <Monitor size={15} />
          </button>
        )}

        <button
          className="hud-icon-btn"
          onClick={toggleBrowserFullscreen}
          title={isBrowserFullscreen ? 'Exit Browser Fullscreen (Esc)' : 'Enter Browser Fullscreen'}
        >
          {isBrowserFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>

        <button
          className="hud-icon-btn hud-settings-btn"
          onClick={() => {
            soundManager.playClick();
            setShowSettingsModal(true);
          }}
          title="Story Experience & Navigation Settings"
        >
          <Settings size={15} />
        </button>
      </aside>

      {/* Main Single Topic Story Area (Edge-to-Edge Tab View) */}
      <article
        className="chapter-card fullscreen-card"
        style={{ '--chapter-color': current.accentColor }}
      >
        {/* Subtle Accent Glow Line at very top */}
        <div
          className="chapter-accent-line"
          style={{ background: current.accentColor }}
        />

        {/* Gamified View vs Standard Story Layout */}
        {isChapter1 ? (
          <Chapter1CharacterCreation
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
            onCompleteSection={handleCompleteSection}
            isCompleted={isCurrentCompleted}
            phase={chapter1Phase}
            isTransitioning={isChapter1Transitioning}
            onGoToReflection={handleChapter1Next}
            onGoToAttributes={handleChapter1Prev}
            onProceedToNextChapter={onNext}
          />
        ) : isChapter3 ? (
          <Chapter3MentorInterview
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
            onCompleteSection={handleCompleteSection}
          />
        ) : isChapter4 ? (
          <Chapter4RubeGoldberg
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
            onCompleteSection={handleCompleteSection}
          />
        ) : isChapter5 ? (
          <Chapter5FlashlightLens
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
            onCompleteSection={handleCompleteSection}
          />
        ) : isChapter6 ? (
          <Chapter6ComfortZone
            topic={current}
            onUpdateTopicData={onUpdateTopicData}
            onCompleteSection={handleCompleteSection}
          />
        ) : (
          /* Standard Fullscreen Story Layout Grid */
          <div className="chapter-layout-grid fullscreen-grid">
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
              {/* Meta & Edit */}
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

              {/* Reading Completion Checkpoint */}
              {!isCurrentCompleted ? (
                <div className="chapter-reading-complete-card">
                  <div className="reading-complete-info">
                    <Sparkles size={18} style={{ color: current.accentColor }} />
                    <div>
                      <h4 className="reading-complete-title">Reflective Checkpoint</h4>
                      <p className="reading-complete-desc">
                        Read through the story and reflections above to finish this section.
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn-mark-complete"
                    onClick={() => {
                      soundManager.playLevelUp();
                      handleCompleteSection(current.id);
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Mark Section Completed</span>
                  </button>
                </div>
              ) : (
                <div className="chapter-reading-complete-card completed">
                  <div className="reading-complete-info">
                    <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
                    <div>
                      <h4 className="reading-complete-title" style={{ color: '#22c55e' }}>
                        Section Completed
                      </h4>
                      <p className="reading-complete-desc">
                        Great work! You have unlocked the journey to advance forward.
                      </p>
                    </div>
                  </div>
                  <span className="reading-unlocked-badge">
                    <Check size={14} /> Unlocked
                  </span>
                </div>
              )}
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
            onClick={isChapter1 && chapter1Phase === 'reflection' ? handleChapter1Prev : onPrev}
            disabled={currentIndex === 0 && !(isChapter1 && chapter1Phase === 'reflection')}
            title={
              isChapter1 && chapter1Phase === 'reflection'
                ? 'Return to Character Attributes (Left Arrow)'
                : 'Previous Chapter (Left Arrow)'
            }
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>

          {/* Center Progress & Status */}
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

            <div className="immersive-chapter-indicator">
              <span className="immersive-crumb">
                {isChapter1 && chapter1Phase === 'reflection'
                  ? `Chapter ${currentIndex + 1} of ${topics.length} • Reflection`
                  : `Chapter ${currentIndex + 1} of ${topics.length}`}
              </span>
              {isCurrentCompleted ? (
                <span className="status-badge-chip completed">
                  <Check size={11} /> Completed
                </span>
              ) : (
                <span className="status-badge-chip in-progress">
                  <Lock size={11} /> In Progress
                </span>
              )}
            </div>
          </div>

          {/* Next Button / Locked Indicator */}
          {canAdvance ? (
            <button
              className="story-nav-btn next-btn unlocked-pulse"
              onClick={isChapter1 && chapter1Phase === 'attributes' ? handleChapter1Next : onNext}
              style={{
                background: `linear-gradient(135deg, ${current.accentColor}, #6366f1)`,
                boxShadow: `0 0 20px -3px ${current.accentColor}60`
              }}
              title={
                isChapter1 && chapter1Phase === 'attributes'
                  ? 'Proceed to Day 1 Reflection (Right Arrow)'
                  : currentIndex === topics.length - 1
                  ? 'Start Over'
                  : 'Next Chapter (Right Arrow)'
              }
            >
              <span>
                {isChapter1 && chapter1Phase === 'attributes'
                  ? 'Next'
                  : currentIndex === topics.length - 1
                  ? 'Restart Story'
                  : 'Next Chapter'}
              </span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <div className="locked-action-group">
              <button
                className="story-nav-btn next-btn locked-disabled"
                disabled
                aria-disabled="true"
                title="Complete this section's activity or reading checkpoint to unlock the Next button"
              >
                <Lock size={14} />
                <span>Next (Locked)</span>
              </button>
              <button
                className="quick-bypass-link"
                onClick={() => handleToggleAlwaysShowNext(true)}
                title="Enable 'Show next page button always' in settings"
              >
                Always show next
              </button>
            </div>
          )}
        </div>
      </footer>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div
          className="settings-modal-backdrop"
          onClick={() => setShowSettingsModal(false)}
        >
          <div
            className="settings-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-dialog-title"
          >
            <div className="settings-modal-header">
              <div className="settings-header-title-wrap">
                <Settings size={18} className="settings-header-icon" />
                <h3 id="settings-dialog-title" className="settings-title">
                  Story & Navigation Settings
                </h3>
              </div>
              <button
                className="settings-close-btn"
                onClick={() => setShowSettingsModal(false)}
                title="Close settings"
              >
                <X size={16} />
              </button>
            </div>

            <div className="settings-modal-body">
              {/* Setting 1: Always Show Next Page Button */}
              <div className="setting-row">
                <div className="setting-info">
                  <label htmlFor="toggle-always-next" className="setting-label">
                    Show next page button always
                  </label>
                  <p className="setting-desc">
                    Allows you to navigate freely to the next chapter immediately, bypassing
                    the completion check on each interactive section.
                  </p>
                </div>
                <div className="setting-control">
                  <button
                    id="toggle-always-next"
                    type="button"
                    role="switch"
                    aria-checked={alwaysShowNext}
                    className={`setting-switch ${alwaysShowNext ? 'on' : 'off'}`}
                    onClick={() => handleToggleAlwaysShowNext()}
                  >
                    <span className="switch-thumb" />
                  </button>
                </div>
              </div>

              {/* Setting 2: Browser Fullscreen */}
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">Browser Full Screen</span>
                  <p className="setting-desc">
                    Expand the browser window to span your entire physical monitor screen.
                  </p>
                </div>
                <div className="setting-control">
                  <button
                    className="setting-action-btn"
                    onClick={toggleBrowserFullscreen}
                  >
                    {isBrowserFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    <span>{isBrowserFullscreen ? 'Exit Full Screen' : 'Go Full Screen'}</span>
                  </button>
                </div>
              </div>

              {/* Setting 3: Sound Effects */}
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">Sound Effects</span>
                  <p className="setting-desc">
                    Audio cues for slider adjustments, dialogue selection, and chapter progression.
                  </p>
                </div>
                <div className="setting-control">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={!isMuted}
                    className={`setting-switch ${!isMuted ? 'on' : 'off'}`}
                    onClick={toggleSound}
                  >
                    <span className="switch-thumb" />
                  </button>
                </div>
              </div>

              {/* Setting 4: Chapter Progress Reset */}
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">Chapter Completion Progress</span>
                  <p className="setting-desc">
                    You have currently completed {completedSections.length} of {topics.length}{' '}
                    chapters.
                  </p>
                </div>
                <div className="setting-control">
                  <button
                    className="setting-action-btn reset-btn"
                    onClick={handleResetProgress}
                    title="Clear completed chapters to re-lock sections"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Progress</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-modal-footer">
              <button
                className="settings-done-btn"
                onClick={() => setShowSettingsModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

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
