import { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  Share2,
  MessageSquare,
  Smile,
  Shield,
  PhoneOff,
  Users,
  Award,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Quote,
  Flame,
  Volume2,
  Heart,
  ThumbsUp,
  RotateCcw,
  Edit3
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { assetUrl } from '../../utils/assetUrl';

export default function Chapter3MentorInterview({
  topic,
  onUpdateTopicData,
  onCompleteSection
}) {
  // Questions and responses dataset
  const defaultQuestions = [
    {
      id: 'failure',
      question: 'Ask about their biggest failure & lowest career moment',
      shortTitle: 'Biggest Failure & Setbacks',
      tag: 'Ego vs. Empathy',
      insightPoints: 25,
      responseQuote:
        'Early in my career, I spent nine months building a design product that completely flopped. Why? Because I was in love with my own ego, not the user’s actual pain point. That failure taught me that letting go of an idea is just as creative as inventing one.',
      analysis:
        'Learning that an accomplished creative leader failed repeatedly gave me permission to treat my own studio experiments not as high-stakes exams, but as iterative learning loops.'
    },
    {
      id: 'career-advice',
      question: 'Ask for genuine early-career advice for a college student',
      shortTitle: 'Authentic Career Advice',
      tag: 'Consistency Over Genius',
      insightPoints: 25,
      responseQuote:
        'Don’t obsess over being “original” on day one—obsess over being reliable, generous, and insatiably curious. Originality isn’t a strategy; it is the inevitable residue of working on your craft with relentless care for thousands of hours.',
      analysis:
        'This completely relieved my anxiety about having a distinct "signature style" immediately. Focus on showing up every single day and doing the work.'
    },
    {
      id: 'burnout',
      question: 'Ask how to handle creative burnout & imposter syndrome',
      shortTitle: 'Burnout & Imposter Syndrome',
      tag: 'Sustainable Passion',
      insightPoints: 25,
      responseQuote:
        'Burnout rarely comes from hard work alone; it comes from performing work disconnected from your authentic curiosity while denying yourself restorative rest. And when imposter syndrome whispers in your ear, remember: everyone in that room is winging it to some degree.',
      analysis:
        'Rest is not the enemy of creativity—it is the soil from which new ideas germinate. Protecting my mental whitespace became my top priority this semester.'
    },
    {
      id: 'worth-fighting',
      question: 'Ask: How do you know when an idea is truly worth fighting for?',
      shortTitle: 'Testing Creative Conviction',
      tag: 'Conviction Testing',
      insightPoints: 25,
      responseQuote:
        'If an idea still keeps you awake with excitement three weeks after the initial adrenaline spike, and if tough critique makes you want to refine it rather than defensively abandon it, that is your signal to fight for it with everything you have.',
      analysis:
        'Differentiating fleeting novelty from deep conviction was the single greatest mental model I took away from our Zoom conversation.'
    }
  ];

  const defaultMentorName = 'Linda Garland';
  const defaultMentorTitle = "Andrew's mom, former marketing employee at P&G";

  const questions = topic.mentorQuestions || defaultQuestions;
  const mentorName = topic.mentorName || defaultMentorName;
  const mentorTitle = topic.mentorTitle || defaultMentorTitle;

  const [meetingStarted, setMeetingStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [floatingReaction, setFloatingReaction] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Custom editable fields
  const [customMentorName, setCustomMentorName] = useState(mentorName);
  const [customMentorTitle, setCustomMentorTitle] = useState(mentorTitle);

  const activeQuestion = questions.find((q) => q.id === activeQuestionId);

  // Calculate Insight Points
  const totalPoints = unlockedIds.reduce((sum, id) => {
    const q = questions.find((item) => item.id === id);
    return sum + (q ? q.insightPoints : 0);
  }, 0);

  const isAllUnlocked = unlockedIds.length === questions.length;

  const handleBeginMeeting = () => {
    setIsConnecting(true);
    soundManager.playLevelUp();
    setTimeout(() => {
      setMeetingStarted(true);
      setIsConnecting(false);
      if (onCompleteSection) {
        onCompleteSection(topic.id);
      }
    }, 450);
  };

  const handleEndMeeting = () => {
    soundManager.playClick();
    setMeetingStarted(false);
    setActiveQuestionId(null);
    setUnlockedIds([]);
  };

  const handleSelectQuestion = (q) => {
    setActiveQuestionId(q.id);
    soundManager.playDialogueSelect();

    if (!unlockedIds.includes(q.id)) {
      setUnlockedIds((prev) => [...prev, q.id]);
      setTimeout(() => {
        soundManager.playInsightUnlocked();
      }, 350);
    }

    if (onCompleteSection) {
      onCompleteSection(topic.id);
    }
  };

  const handleSendReaction = (emoji) => {
    setFloatingReaction(emoji);
    soundManager.playClick();
    setTimeout(() => setFloatingReaction(null), 2000);
  };

  const handleSaveCustomMentor = (e) => {
    e.preventDefault();
    if (onUpdateTopicData) {
      onUpdateTopicData(topic.id, {
        mentorName: customMentorName,
        mentorTitle: customMentorTitle
      });
    }
    setIsEditing(false);
    soundManager.playClick();
  };

  return (
    <div className="mentor-zoom-experience">
      {!meetingStarted ? (
        /* Blank Video Call Screen / Pre-Meeting Lobby */
        <div className="zoom-lobby-container">
          {/* Zoom Window Header Frame */}
          <div className="zoom-top-bar zoom-lobby-top-bar">
            <div className="zoom-window-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>

            <div className="zoom-meeting-meta">
              <span className="meeting-topic-title">
                Video Call: {customMentorName}
              </span>
              <span className="security-lock">
                <Shield size={12} />
                <span>Encrypted HD</span>
              </span>
            </div>

            <div className="zoom-lobby-status-tag">
              <span className="lobby-pulse-dot" />
              <span>Ready to Connect</span>
            </div>
          </div>

          {/* Blank Video Screen */}
          <div className="zoom-blank-screen">
            <div className="blank-screen-vignette" />

            <div className="blank-screen-content">
              {/* Standby Radar Bubble */}
              <div className="standby-avatar-bubble">
                <Video size={36} className="standby-video-icon" />
                <div className="standby-radar-ring" />
              </div>

              {/* Begin Meeting Button */}
              <button
                type="button"
                className="btn-begin-meeting"
                onClick={handleBeginMeeting}
                disabled={isConnecting}
                title={`Connect to video call with ${customMentorName}`}
              >
                {isConnecting ? (
                  <>
                    <span className="meeting-spinner" />
                    <span>Connecting Call...</span>
                  </>
                ) : (
                  <>
                    <Video size={18} />
                    <span>Begin Meeting</span>
                  </>
                )}
              </button>

              {/* Mentor Identity Display */}
              <div className="standby-mentor-block">
                <h2 className="standby-mentor-name">{customMentorName}</h2>
                <p className="standby-mentor-title">{customMentorTitle}</p>
              </div>

              {/* Hardware Device Readiness */}
              <div className="standby-device-checks">
                <span className="device-check-pill">
                  <Mic size={13} />
                  <span>Microphone Ready</span>
                </span>
                <span className="device-check-pill">
                  <Video size={13} />
                  <span>1080p HD Video</span>
                </span>
                <span className="device-check-pill">
                  <Shield size={13} />
                  <span>Private Call</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* In-Meeting Connected Video Screen & Dialogue Tree */
        <>
          {/* Zoom Window Header Frame */}
          <div className="zoom-top-bar">
            <div className="zoom-window-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>

            <div className="zoom-meeting-meta">
              <div className="recording-pill">
                <span className="rec-dot blink" />
                <span>REC 00:44:18</span>
              </div>
              <span className="meeting-topic-title">
                Mentor Interview: {customMentorName} • Topic: Creative Wisdom & Philosophy
              </span>
              <span className="security-lock">
                <Shield size={12} />
                <span>Encrypted HD</span>
              </span>
            </div>

            <div className="zoom-points-pill">
              <Sparkles size={14} className="sparkle-gold" />
              <span className="points-label">Insight Points:</span>
              <strong className="points-number">{totalPoints} / 100</strong>
            </div>
          </div>

          {/* Main Grid: Zoom Video Stage + Interactive Dialogue Tree */}
          <div className="zoom-arena-grid">
            {/* Left Column: Simulated Zoom Video Call Tile */}
            <div className="zoom-video-stage">
              <div className={`mentor-video-tile ${activeQuestionId ? 'speaking' : ''}`}>
                <img
                  src={assetUrl('/topics/mentor-zoom.jpg')}
                  alt={customMentorName}
                  className="mentor-webcam-feed"
                />
                <div className="webcam-lighting-layer" />

                {/* Top Left Speaker Badge */}
                <div className="speaker-name-badge">
                  <span className="mentor-audio-wave">
                    <span className="bar b1" />
                    <span className="bar b2" />
                    <span className="bar b3" />
                  </span>
                  <span className="mentor-name-text">
                    {customMentorName} ({activeQuestionId ? 'Speaking...' : 'Listening'})
                  </span>
                </div>

                {/* Mentor Role Tag */}
                <div className="mentor-role-overlay">
                  <span>{customMentorTitle}</span>
                </div>

                {/* Self View (Picture-in-Picture) */}
                <div className="self-view-tile">
                  <div className="self-avatar-placeholder">
                    <span>YOU</span>
                  </div>
                  <span className="self-name">You {isMuted ? '🔇' : '🎙️'}</span>
                </div>

                {/* Floating Reaction Animation */}
                {floatingReaction && (
                  <div className="floating-reaction-bubble">
                    <span>{floatingReaction}</span>
                  </div>
                )}

                {/* Live Closed Caption Subtitle */}
                {activeQuestion ? (
                  <div className="zoom-closed-caption">
                    <div className="cc-label">
                      <Volume2 size={13} />
                      <span>{customMentorName} says:</span>
                    </div>
                    <p className="cc-quote">“{activeQuestion.responseQuote}”</p>
                  </div>
                ) : (
                  <div className="zoom-call-prompt-hint">
                    <span>👈 Click any dialogue question below to ask {customMentorName}</span>
                  </div>
                )}
              </div>

              {/* Zoom In-Call Toolbar */}
              <div className="zoom-control-bar">
                <div className="control-group">
                  <button
                    className={`tool-icon-btn ${isMuted ? 'muted' : ''}`}
                    onClick={() => setIsMuted(!isMuted)}
                    title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                  >
                    {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                    <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                  </button>

                  <button className="tool-icon-btn" title="Video status">
                    <Video size={16} />
                    <span>Stop Video</span>
                  </button>
                </div>

                <div className="control-group">
                  <button className="tool-icon-btn">
                    <Users size={16} />
                    <span>Participants (2)</span>
                  </button>

                  <button className="tool-icon-btn">
                    <Share2 size={16} />
                    <span>Share Screen</span>
                  </button>

                  <div className="reaction-dropdown">
                    <button
                      className="tool-icon-btn reaction-btn"
                      onClick={() => handleSendReaction('👏')}
                      title="Applaud mentor"
                    >
                      <Smile size={16} />
                      <span>React</span>
                    </button>
                    <div className="quick-emojis">
                      <button onClick={() => handleSendReaction('💡')} title="Insightful">💡</button>
                      <button onClick={() => handleSendReaction('❤️')} title="Loved this">❤️</button>
                      <button onClick={() => handleSendReaction('🙌')} title="Spot on">🙌</button>
                    </div>
                  </div>
                </div>

                <div className="control-group">
                  <button
                    className="leave-call-btn"
                    onClick={handleEndMeeting}
                    title="Leave Video Call & Return to Lobby"
                  >
                    <PhoneOff size={14} />
                    <span>End Meeting</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Dialogue Tree & Wisdom Unlocked */}
            <div className="dialogue-tree-column">
              <div className="tree-header">
                <div className="tree-badge">
                  <HelpCircle size={14} />
                  <span>INTERACTIVE DIALOGUE TREE • SELECT AN INQUIRY</span>
                </div>
                <p className="tree-instruction">
                  Click a question card below to ask your mentor. Each question reveals a core philosophy and awards <strong>+25 Insight Points</strong>.
                </p>
              </div>

              {/* Question Cards List */}
              <div className="dialogue-cards-list">
                {questions.map((q, idx) => {
                  const isUnlocked = unlockedIds.includes(q.id);
                  const isActive = activeQuestionId === q.id;

                  return (
                    <div
                      key={q.id}
                      className={`dialogue-card ${isActive ? 'active' : ''} ${isUnlocked ? 'unlocked' : ''}`}
                      onClick={() => handleSelectQuestion(q)}
                    >
                      <div className="card-top-row">
                        <span className="card-q-number">0{idx + 1}</span>
                        <span className="card-theme-tag">{q.tag}</span>
                        <span className={`points-badge ${isUnlocked ? 'earned' : ''}`}>
                          {isUnlocked ? '+25 Points Unlocked' : '+25 Points'}
                        </span>
                      </div>

                      <h4 className="dialogue-question-title">{q.question}</h4>

                      {/* If active, show detailed reflection note */}
                      {isActive && (
                        <div className="unlocked-analysis-box">
                          <div className="analysis-header">
                            <Quote size={13} />
                            <span>My Reflection & Classroom Application:</span>
                          </div>
                          <p className="analysis-text">{q.analysis}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* All Questions Complete Banner */}
              {isAllUnlocked && (
                <div className="wisdom-network-synced-banner">
                  <div className="synced-icon">
                    <Award size={24} />
                  </div>
                  <div className="synced-text">
                    <h4>🎉 Wisdom Network Synchronized (100 / 100)</h4>
                    <p>
                      You unlocked all 4 core pillars from {customMentorName}. Creative insight unlocked:
                      <em> “Protect your curiosity, treat failure as iterative data, and give yourself permission to be in progress.”</em>
                    </p>
                  </div>
                </div>
              )}

              {/* Personalize Mentor Details Action */}
              <div className="personalize-mentor-footer">
                <button
                  className="personalize-btn"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 size={13} />
                  <span>{isEditing ? 'Close Personalization' : 'Personalize Mentor Name & Role'}</span>
                </button>
              </div>

              {isEditing && (
                <form onSubmit={handleSaveCustomMentor} className="mentor-edit-form">
                  <div className="form-row">
                    <label>
                      Mentor Name:
                      <input
                        type="text"
                        value={customMentorName}
                        onChange={(e) => setCustomMentorName(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Mentor Title / Organization:
                      <input
                        type="text"
                        value={customMentorTitle}
                        onChange={(e) => setCustomMentorTitle(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <button type="submit" className="save-mentor-btn">
                    Save Mentor Details
                  </button>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
