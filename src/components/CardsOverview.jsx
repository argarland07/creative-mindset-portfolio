import { useState, useEffect } from 'react';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Zap,
  Camera,
  Users,
  Wrench,
  Video,
  Folder,
  Layers,
  ChevronRight,
  Play
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function CardsOverview({ topics, onSelectTopic }) {
  // Automatic Live Tile flip timer to simulate Windows 10 Live Tiles!
  const [flippedTileIds, setFlippedTileIds] = useState([]);

  useEffect(() => {
    // Randomly flip a tile every 4 seconds to show live content peek
    const interval = setInterval(() => {
      if (topics.length === 0) return;
      const randomIdx = Math.floor(Math.random() * topics.length);
      const targetId = topics[randomIdx].id;

      setFlippedTileIds((prev) =>
        prev.includes(targetId)
          ? prev.filter((id) => id !== targetId)
          : [...prev, targetId]
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [topics]);

  const getTopicIcon = (id) => {
    switch (id) {
      case 'first-day':
        return <Zap size={18} />;
      case 'mentor-interview':
        return <Video size={18} />;
      case 'rube-goldberg':
        return <Wrench size={18} />;
      case 'night-photos':
        return <Camera size={18} />;
      case 'social-curiosity':
        return <Users size={18} />;
      default:
        return <BookOpen size={18} />;
    }
  };

  return (
    <section className="metro-start-screen md-overview-screen">
      {/* Material Hero Bar with Start Walkthrough Button */}
      <div className="metro-start-header md-overview-header">
        <div className="metro-start-hero-bar md-hero-bar">
          <div className="metro-start-title-col">
            <div className="metro-start-title-row">
              <h1 className="metro-start-title md-title">Creative Portfolio</h1>
              <span className="metro-start-subtitle md-subtitle">
                Andrew Garland • ESP103
              </span>
            </div>
            <p className="metro-start-hint md-hint">
              Semester journey across 8 chapters. Click <strong>Start Walkthrough</strong> to begin from Chapter 1, or select any chapter card to jump directly into an interactive experiment.
            </p>
          </div>

          {/* Primary Material Extended Button */}
          <button
            className="btn-start-story-hero md-hero-btn"
            onClick={() => {
              soundManager.playSlideTransition();
              onSelectTopic(0);
            }}
            title="Launch the story walkthrough from Chapter 1"
          >
            <div className="start-icon-square md-start-icon">
              <Play size={20} fill="currentColor" />
            </div>
            <div className="start-btn-texts">
              <span className="start-btn-main">START WALKTHROUGH</span>
              <span className="start-btn-sub">Begin Chapter 01: 1st Day of Class</span>
            </div>
            <ArrowRight size={20} className="start-arrow-icon" />
          </button>
        </div>
      </div>

      {/* Group 1: Core Creative Chapters */}
      <div className="metro-tile-group md-card-group">
        <div className="metro-group-header">
          <span className="group-title-text">CHAPTERS • INTERACTIVE EXPERIENCES</span>
          <div className="group-header-line" />
        </div>

        <div className="metro-live-tiles-grid">
          {topics.map((topic, index) => {
            const isFlipped = flippedTileIds.includes(topic.id);
            // First Day and Night Photos are Wide Tiles (2-col span)
            const isWide = index === 0 || index === 4;

            return (
              <div
                key={topic.id}
                className={`metro-tile ${isWide ? 'tile-wide' : 'tile-medium'} ${
                  isFlipped ? 'tile-peek' : ''
                }`}
                style={{ '--tile-accent': topic.accentColor }}
                onClick={() => {
                  soundManager.playClick();
                  onSelectTopic(index);
                }}
                title={`Launch Chapter ${index + 1}: ${topic.title}`}
              >
                {/* 3D Tile Flip Container */}
                <div className="tile-flipper">
                  {/* Front Face: Image, Number & Chapter Title */}
                  <div className="tile-face tile-front">
                    <img
                      src={topic.image}
                      alt={topic.title}
                      className="tile-bg-image"
                      loading="lazy"
                    />
                    <div className="tile-shade-overlay" />

                    {/* Top Tile Badge */}
                    <div className="tile-top-bar">
                      <span className="tile-category-tag">
                        {getTopicIcon(topic.id)}
                        <span>CH 0{index + 1}</span>
                      </span>
                      {topic.gameConcept && (
                        <span className="tile-game-pill">LIVE GAME</span>
                      )}
                    </div>

                    {/* Bottom Metadata */}
                    <div className="tile-bottom-meta">
                      <h3 className="tile-title">{topic.title}</h3>
                      <p className="tile-subtitle">{topic.subtitle}</p>
                    </div>

                    {/* Windows Tile Accent Corner Tab */}
                    <div className="tile-accent-stripe" style={{ background: topic.accentColor }} />
                  </div>

                  {/* Back Face: Key Philosophical Takeaway & Live Peek */}
                  <div
                    className="tile-face tile-back"
                    style={{ background: topic.accentColor }}
                  >
                    <div className="tile-back-content">
                      <div className="back-header">
                        <span className="back-ch-number">0{index + 1}</span>
                        <span className="back-status">KEY TAKEAWAY</span>
                      </div>
                      <p className="back-quote">“{topic.keyTakeaway}”</p>
                      <div className="back-footer">
                        <span className="launch-text">Click to open & explore</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Group 2: System Quick Info Tiles */}
      <div className="metro-tile-group secondary-group md-card-group">
        <div className="metro-group-header">
          <span className="group-title-text">HIGHLIGHTS • CREATIVE EVOLUTION</span>
          <div className="group-header-line" />
        </div>

        <div className="metro-stats-tiles-row">
          <div className="metro-tile tile-stat tile-stat-blue">
            <span className="stat-big-number">8</span>
            <span className="stat-label">Semester Chapters</span>
            <span className="stat-sub">Sequential Story</span>
          </div>

          <div className="metro-tile tile-stat tile-stat-purple">
            <span className="stat-big-number">4+</span>
            <span className="stat-label">Gamified Mechanics</span>
            <span className="stat-sub">RPG, Zoom, Physics, Lens, NPC</span>
          </div>

          <div className="metro-tile tile-stat tile-stat-green">
            <span className="stat-big-number">100%</span>
            <span className="stat-label">Original Field Work</span>
            <span className="stat-sub">Photos, Interviews & Making</span>
          </div>

          <div className="metro-tile tile-stat tile-stat-gold">
            <span className="stat-big-number">08</span>
            <span className="stat-label">Key Takeaways</span>
            <span className="stat-sub">Mindset & Evolution</span>
          </div>
        </div>
      </div>
    </section>
  );
}
