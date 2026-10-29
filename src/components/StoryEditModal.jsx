import { useState } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function StoryEditModal({ topic, isOpen, onClose, onSave, onResetDefault }) {
  const [prevTopicId, setPrevTopicId] = useState(topic?.id);
  const [story, setStory] = useState(topic?.story || '');
  const [reflection, setReflection] = useState(topic?.reflection || '');
  const [keyTakeaway, setKeyTakeaway] = useState(topic?.keyTakeaway || '');

  if (topic && prevTopicId !== topic.id) {
    setPrevTopicId(topic.id);
    setStory(topic.story || '');
    setReflection(topic.reflection || '');
    setKeyTakeaway(topic.keyTakeaway || '');
  }

  if (!isOpen || !topic) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(topic.id, {
      story,
      reflection,
      keyTakeaway
    });
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="story-edit-container" onClick={(e) => e.stopPropagation()}>
        <div className="story-edit-header">
          <div>
            <span className="edit-chapter-tag">{topic.title}</span>
            <h3>Personalize Your Notes: {topic.title}</h3>
            <p>Customize the story narrative, reflection, or takeaway with your own class memories.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="story-edit-form">
          <div className="form-group">
            <label>The Story & Experience</label>
            <textarea
              rows={5}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="What happened during this assignment or day in class?..."
              required
            />
          </div>

          <div className="form-group">
            <label>Personal Reflection & Growth</label>
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did you learn about yourself or your creative process?..."
              required
            />
          </div>

          <div className="form-group">
            <label>Key Creative Takeaway (One Sentence)</label>
            <input
              type="text"
              value={keyTakeaway}
              onChange={(e) => setKeyTakeaway(e.target.value)}
              placeholder="A memorable insight or quote..."
              required
            />
          </div>

          <div className="story-edit-footer">
            <button
              type="button"
              className="reset-btn"
              onClick={() => {
                if (confirm('Reset this topic back to the original default text?')) {
                  onResetDefault(topic.id);
                  onClose();
                }
              }}
            >
              <RotateCcw size={14} />
              <span>Reset to default notes</span>
            </button>

            <div className="action-buttons">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="save-btn"
                style={{ background: topic.accentColor }}
              >
                <Save size={15} />
                <span>Save Reflections</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
