import { useState } from 'react';
import { X, Plus, Save, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function ProjectEditorModal({ isOpen, onClose, onAddProject, onResetProjects }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Creative Coding');
  const [tagline, setTagline] = useState('');
  const [summary, setSummary] = useState('');
  const [walkthroughScript, setWalkthroughScript] = useState('');
  const [tags, setTags] = useState('React, Creative Tech, Interaction');
  const [colorAccent, setColorAccent] = useState('#a855f7');
  const [imageChoice, setImageChoice] = useState('/projects/project1.jpg');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim()) return;

    const newProject = {
      id: `custom-${Date.now()}`,
      title,
      shortTitle: title.split(':')[0].slice(0, 18),
      category,
      categoryKey: category.toLowerCase().includes('code') ? 'code' : category.toLowerCase().includes('narrative') ? 'narrative' : 'audio',
      tagline,
      year: '2026',
      image: imageChoice,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      colorAccent,
      summary: summary || tagline,
      walkthroughScript: walkthroughScript || `In this project, ${title}, I focused on exploring ${tagline}.`,
      keyQuestions: 'How can this project broaden our creative boundaries in class?',
      creativeProcess: {
        inspiration: 'Drawn from personal experimental sessions and creative course prompts.',
        challenges: 'Refining the visual and conceptual communication.',
        takeaway: 'Discovered novel ways to merge aesthetics with interactive functionality.'
      },
      stats: [
        { label: 'Medium', value: category },
        { label: 'Status', value: 'Complete' }
      ],
      interactiveType: 'particles'
    };

    onAddProject(newProject);
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="editor-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="editor-modal-header">
          <div>
            <h3>Add New Portfolio Project</h3>
            <p>Introduce a new creative work to your showcase cards & walkthrough</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Dreamweaver: Generative Neural Landscapes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Creative Coding">Creative Coding</option>
                <option value="Speculative Narrative">Speculative Narrative</option>
                <option value="Audiovisual Installation">Audiovisual Installation</option>
                <option value="Kinetic Architecture">Kinetic Architecture</option>
                <option value="Visual Design & 3D">Visual Design & 3D</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Accent Color</label>
              <div className="color-picker-row">
                {['#c084fc', '#2dd4bf', '#fbbf24', '#fb7185', '#38bdf8', '#a3e635'].map((c) => (
                  <button
                    type="button"
                    key={c}
                    className={`color-dot ${colorAccent === c ? 'selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setColorAccent(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Cover Artwork</label>
            <div className="cover-picker-row">
              {['/projects/project1.jpg', '/projects/project2.jpg', '/projects/project3.jpg', '/projects/project4.jpg'].map((img, i) => (
                <div
                  key={img}
                  className={`cover-thumb ${imageChoice === img ? 'active' : ''}`}
                  onClick={() => setImageChoice(img)}
                >
                  <img src={img} alt={`Option ${i + 1}`} />
                  <span>Art {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Tagline / One-liner</label>
            <input
              type="text"
              required
              placeholder="A brief compelling hook about the piece"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Overview Summary</label>
            <textarea
              rows={3}
              placeholder="Describe the conceptual basis and technologies used..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Walkthrough Presentation Script (Speaker Notes)</label>
            <textarea
              rows={3}
              placeholder="What will you say to the class when this project appears on the slide?..."
              value={walkthroughScript}
              onChange={(e) => setWalkthroughScript(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Three.js, Sound Design, Figma, Physical Computing"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="editor-form-footer">
            <button
              type="button"
              className="reset-btn"
              onClick={() => {
                if (confirm('Reset portfolio to the original starter projects?')) {
                  onResetProjects();
                  onClose();
                }
              }}
            >
              <RotateCcw size={15} />
              <span>Reset to Defaults</span>
            </button>

            <div className="action-buttons">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-btn" style={{ background: colorAccent }}>
                <Save size={16} />
                <span>Add to Portfolio</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
