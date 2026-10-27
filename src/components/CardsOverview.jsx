import { ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { assetUrl } from '../utils/assetUrl';

export default function CardsOverview({ onSelectTopic }) {
  const handleBegin = () => {
    soundManager.playSlideTransition();
    if (onSelectTopic) {
      onSelectTopic(0);
    }
  };

  return (
    <section className="homepage-hero-screen" aria-label="Creative Mindset Portfolio Home">
      <div
        className="homepage-hero-bg"
        style={{ backgroundImage: `url(${assetUrl('/homepage-bg.jpg')})` }}
        role="img"
        aria-label="Miami University illuminated gate background"
      />

      <div className="homepage-hero-content">
        <h1 className="homepage-hero-title">
          Welcome to my creative journey so far this semester :)
        </h1>
        <button
          type="button"
          className="homepage-hero-btn"
          onClick={handleBegin}
        >
          <span>Begin Journey</span>
          <ArrowRight size={17} className="homepage-btn-arrow" />
        </button>
      </div>
    </section>
  );
}
