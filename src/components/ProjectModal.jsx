import { useState, useEffect } from 'react';
import { X, Play, Sparkles, BookOpen, Cpu, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import ProjectInteractiveWidget from './ProjectInteractiveWidget';
import { soundManager } from '../utils/audio';

export default function ProjectModal({ project, onClose, onLaunchWalkthrough }) {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-hero">
          <img src={project.image} alt={project.title} className="modal-hero-img" />
          <div className="modal-hero-gradient" />
          <div className="modal-hero-content">
            <span className="modal-category" style={{ borderColor: project.colorAccent }}>
              {project.category}
            </span>
            <h2 className="modal-title">{project.title}</h2>
            <p className="modal-tagline">{project.tagline}</p>
          </div>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BookOpen size={16} />
            <span>Overview & Lore</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'sandbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('sandbox')}
          >
            <Cpu size={16} />
            <span>Interactive Sandbox</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'process' ? 'active' : ''}`}
            onClick={() => setActiveTab('process')}
          >
            <Lightbulb size={16} />
            <span>Class Reflections & Process</span>
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'overview' && (
            <div className="tab-pane">
              <div className="overview-stats-grid">
                {project.stats?.map((st) => (
                  <div key={st.label} className="stat-card">
                    <span className="stat-value" style={{ color: project.colorAccent }}>
                      {st.value}
                    </span>
                    <span className="stat-label">{st.label}</span>
                  </div>
                ))}
              </div>

              <div className="section-block">
                <h4 className="section-label">Summary & Conceptual Framing</h4>
                <p className="section-text">{project.summary}</p>
              </div>

              <div className="section-block inquiry-box" style={{ borderLeftColor: project.colorAccent }}>
                <h4 className="inquiry-title">Central Creative Inquiry:</h4>
                <p className="inquiry-quote">“{project.keyQuestions}”</p>
              </div>

              <div className="section-block">
                <h4 className="section-label">Technologies & Mediums</h4>
                <div className="modal-tags-list">
                  {project.tags.map((tag) => (
                    <span key={tag} className="modal-tag-badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sandbox' && (
            <div className="tab-pane">
              <ProjectInteractiveWidget project={project} />
            </div>
          )}

          {activeTab === 'process' && (
            <div className="tab-pane process-grid">
              <div className="process-card">
                <div className="process-header">
                  <Sparkles size={18} style={{ color: '#fbbf24' }} />
                  <h4>1. Inspiration & Genesis</h4>
                </div>
                <p>{project.creativeProcess.inspiration}</p>
              </div>

              <div className="process-card">
                <div className="process-header">
                  <Cpu size={18} style={{ color: '#38bdf8' }} />
                  <h4>2. Challenges & Iteration</h4>
                </div>
                <p>{project.creativeProcess.challenges}</p>
              </div>

              <div className="process-card highlight-card" style={{ borderColor: project.colorAccent }}>
                <div className="process-header">
                  <CheckCircle2 size={18} style={{ color: project.colorAccent }} />
                  <h4>3. Class Critique & Key Takeaway</h4>
                </div>
                <p>{project.creativeProcess.takeaway}</p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="footer-notes-hint">
            <span>Ready to present this in front of class?</span>
          </div>
          <button
            className="present-btn"
            onClick={() => {
              soundManager.playClick();
              onLaunchWalkthrough(project.id);
            }}
          >
            <Play size={16} fill="currentColor" />
            <span>Launch Presentation Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
}
