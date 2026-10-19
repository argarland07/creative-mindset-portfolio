import { useState, useRef } from 'react';
import { Play, ArrowUpRight, Sparkles, Layers } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function ProjectCard({ project, index, onSelectProject, onStartWalkthroughAt }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -9;
    const rY = ((x - centerX) / centerX) * 9;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundManager.playHover(index);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      className={`project-card ${isHovered ? 'hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${isHovered ? -8 : 0}px)`,
        '--card-accent': project.colorAccent
      }}
    >
      <div className="card-ambient-glow" style={{ background: project.colorAccent }} />
      
      <div className="card-media">
        <img src={project.image} alt={project.title} loading="lazy" />
        <div className="card-media-overlay" />
        <span className="card-badge" style={{ borderColor: project.colorAccent }}>
          {project.category}
        </span>
        <span className="card-year">{project.year}</span>

        <button
          className="quick-play-btn"
          title="Start Walkthrough from this project"
          onClick={(e) => {
            e.stopPropagation();
            soundManager.playClick();
            onStartWalkthroughAt(index);
          }}
        >
          <Play size={14} fill="currentColor" />
          <span>Present</span>
        </button>
      </div>

      <div className="card-body">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-tagline">{project.tagline}</p>

        <div className="card-tags">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="tag-pill more-pill">+{project.tags.length - 3}</span>
          )}
        </div>

        <div className="card-footer">
          <button
            className="explore-btn"
            onClick={() => {
              soundManager.playClick();
              onSelectProject(project);
            }}
          >
            <span>Explore Case Study</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
