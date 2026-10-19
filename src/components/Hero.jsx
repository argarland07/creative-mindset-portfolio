import { Play, Sparkles, Compass, Lightbulb, Flame, Award } from 'lucide-react';
import { categories } from '../data/projects';
import { soundManager } from '../utils/audio';

export default function Hero({
  activeCategory,
  onSelectCategory,
  onStartWalkthrough,
  projectCount
}) {
  return (
    <section className="hero-section">
      <div className="hero-badge-pill">
        <Sparkles size={14} className="sparkle-icon" />
        <span>STUDIO PRESENTATION • DIGITAL CREATIVITY PORTFOLIO</span>
      </div>

      <h1 className="hero-headline">
        Bridging Algorithms, <br />
        <span className="gradient-text">Art & Tactile Experience</span>
      </h1>

      <p className="hero-description">
        A curated interactive collection of computational experiments, speculative narrative
        worldbuilding, spatial soundscapes, and kinetic metamaterials crafted for our creative studio class.
      </p>

      {/* Main Action CTAs */}
      <div className="hero-cta-group">
        <button
          className="hero-primary-btn"
          onClick={() => {
            soundManager.playClick();
            onStartWalkthrough(0);
          }}
        >
          <div className="btn-glow-layer" />
          <Play size={18} fill="currentColor" />
          <span>Launch Animated Walkthrough</span>
          <span className="cta-counter-chip">{projectCount} Works</span>
        </button>

        <a href="#projects-grid" className="hero-secondary-btn">
          <Compass size={17} />
          <span>Browse Project Cards</span>
        </a>
      </div>

      {/* Highlights ribbon */}
      <div className="hero-stats-ribbon">
        <div className="ribbon-item">
          <span className="ribbon-num">04</span>
          <span className="ribbon-lbl">Curated Works</span>
        </div>
        <div className="ribbon-divider" />
        <div className="ribbon-item">
          <span className="ribbon-num">60 FPS</span>
          <span className="ribbon-lbl">Real-time Shaders</span>
        </div>
        <div className="ribbon-divider" />
        <div className="ribbon-item">
          <span className="ribbon-num">100%</span>
          <span className="ribbon-lbl">Interactive Sandboxes</span>
        </div>
        <div className="ribbon-divider" />
        <div className="ribbon-item">
          <span className="ribbon-num">Class Ready</span>
          <span className="ribbon-lbl">Speaker Notes Included</span>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div id="projects-grid" className="category-filter-bar">
        <span className="filter-label">Filter by Medium:</span>
        <div className="filter-chips">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`chip-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                onSelectCategory(cat.id);
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
