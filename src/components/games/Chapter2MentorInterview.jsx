import { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  Share2,
  Smile,
  Shield,
  PhoneOff,
  Users,
  Award,
  Sparkles,
  HelpCircle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Edit3,
  Film,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Quote
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { assetUrl } from '../../utils/assetUrl';

// Questions and responses dataset - The 4 core recorded interview inquiries
const DEFAULT_QUESTIONS = [
  {
    id: 'original-meaning',
    question: 'What did creativity originally mean to you?',
    shortTitle: 'Original Meaning of Creativity',
    tag: 'Early Perceptions',
    insightPoints: 25,
    videoUrl: assetUrl('/topics/mentor/original-meaning-of-creativity.mp4'),
    duration: '0:12',
    hasVideo: true,
    responseQuote:
      'Originally, I thought creativity just meant being artistic—like painting, drawing, or being a musician. I didn’t realize until much later that creativity is really about how you think and how you approach challenges in everyday life.',
    analysis:
      'Linda’s reflection mirrored my own initial misconceptions. Growing up, I assumed creativity was an exclusive genetic gift reserved for painters and musicians. Realizing that creativity is a universal problem-solving mindset completely changed how I see my own potential.'
  },
  {
    id: 'why-marketing',
    question: 'Why did you go into marketing?',
    shortTitle: 'Why Marketing?',
    tag: 'Career Origin',
    insightPoints: 25,
    videoUrl: assetUrl('/topics/mentor/why-marketing.mp4'),
    duration: '0:13',
    hasVideo: true,
    responseQuote:
      'I went into marketing because I was drawn to the intersection of human behavior and storytelling. It wasn’t just about selling things—it was about understanding what people care about, how they communicate, and crafting messages that truly resonate.',
    analysis:
      'Understanding Linda’s motivation for entering marketing clarified how creative instincts translate into industry. Marketing wasn’t an abstract corporate function—it was a medium to study human curiosity, psychology, and compelling communication.'
  },
  {
    id: 'creativity-in-job',
    question: 'What is one way you used creativity in your job?',
    shortTitle: 'Creativity on the Job',
    tag: 'Applied Innovation',
    insightPoints: 25,
    videoUrl: assetUrl('/topics/mentor/creativity-on-the-job.mp4'),
    duration: '0:25',
    hasVideo: true,
    responseQuote:
      'In marketing at P&G, creativity meant understanding consumer habits deeply and finding unexpected, simple ways to connect products to real daily routines. It’s about solving real human frictions rather than just chasing flashy campaigns.',
    analysis:
      'Linda’s career at P&G showed me that real-world creativity is rooted in customer empathy and practical problem-solving. True innovation isn’t about making noise—it’s about noticing what others overlook and delivering authentic value.'
  },
  {
    id: 'why-creativity',
    question: 'Why is creativity important?',
    shortTitle: 'Why Creativity Matters',
    tag: 'Core Purpose',
    insightPoints: 25,
    videoUrl: assetUrl('/topics/mentor/why-creativity-matters.mp4'),
    duration: '0:24',
    hasVideo: true,
    responseQuote:
      'Creativity is essential because it allows us to look beyond conventional answers and connect disparate ideas. It’s not just an artistic pursuit—it’s how we adapt, solve real problems, and discover meaning in our work.',
    analysis:
      'Hearing Linda explain why creativity matters grounded my entire semester. In marketing and in everyday life, creativity isn’t just decorative—it is an active problem-solving muscle that helps us navigate ambiguity and bring novel solutions to the table.'
  }
];

const DEFAULT_MENTOR_NAME = 'Linda Garland';
const DEFAULT_MENTOR_TITLE = "Andrew's mom, former marketing employee at P&G";

export default function Chapter2MentorInterview({
  topic,
  onUpdateTopicData,
  onCompleteSection,
  phase = 'interview', // 'interview' | 'reflection'
  isTransitioning = false,
  onGoToReflection,
  onGoToInterview,
  onProceedToNextChapter
}) {
  const questions = topic.mentorQuestions || DEFAULT_QUESTIONS;
  const mentorName = topic.mentorName || DEFAULT_MENTOR_NAME;
  const mentorTitle =
    topic.mentorTitle && topic.mentorTitle !== 'Executive Creative Mentor'
      ? topic.mentorTitle
      : DEFAULT_MENTOR_TITLE;

  const [meetingStarted, setMeetingStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [floatingReaction, setFloatingReaction] = useState(null);
  const [isMuted, setIsMuted] = useState(true); // Andrew's mic
  const [isEditing, setIsEditing] = useState(false);

  // Video playback states
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(24);
  const [isVideoMuted, setIsVideoMuted] = useState(false); // Mentor video audio
  const [videoEnded, setVideoEnded] = useState(false);

  // Custom editable fields
  const [customMentorName, setCustomMentorName] = useState(mentorName);
  const [customMentorTitle, setCustomMentorTitle] = useState(mentorTitle);

  const activeQuestion = questions.find((q) => q.id === activeQuestionId);

  // Calculate Insight Points (capped at 100)
  const totalPoints = Math.min(
    100,
    unlockedIds.reduce((sum, id) => {
      const q = questions.find((item) => item.id === id);
      return sum + (q ? q.insightPoints : 0);
    }, 0)
  );

  const isAllUnlocked = unlockedIds.length === questions.length;

  // Auto-play video whenever active question changes and contains a videoUrl
  useEffect(() => {
    if (!meetingStarted || !activeQuestionId) return;

    const currentQ = questions.find((q) => q.id === activeQuestionId);
    if (!currentQ?.videoUrl) return;

    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.warn('Autoplay prevented or waiting for interaction:', err);
              setIsPlaying(false);
            });
        }
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [activeQuestionId, meetingStarted, questions]);

  // Pause video if transitioning to reflection phase
  useEffect(() => {
    if (phase === 'reflection' && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [phase]);

  const handleBeginMeeting = () => {
    setIsConnecting(true);
    soundManager.playLevelUp();
    setTimeout(() => {
      setMeetingStarted(true);
      setIsConnecting(false);
    }, 450);
  };

  const handleEndMeeting = () => {
    soundManager.playClick();
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    setMeetingStarted(false);
    setActiveQuestionId(null);
  };

  const handleSelectQuestion = (q) => {
    setActiveQuestionId(q.id);
    setVideoEnded(false);
    setCurrentTime(0);
    setIsPlaying(false);
    soundManager.playDialogueSelect();

    if (!unlockedIds.includes(q.id)) {
      const nextUnlocked = [...unlockedIds, q.id];
      setUnlockedIds(nextUnlocked);
      setTimeout(() => {
        soundManager.playInsightUnlocked();
      }, 350);

      // Only complete section when all 4 questions have been answered!
      if (nextUnlocked.length === questions.length && onCompleteSection) {
        onCompleteSection(topic.id);
      }
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
    soundManager.playClick();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      const nextMuted = !isVideoMuted;
      videoRef.current.muted = nextMuted;
      setIsVideoMuted(nextMuted);
    }
  };

  const handleReplayVideo = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      setVideoEnded(false);
    }
    soundManager.playClick();
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setVideoEnded(true);
    soundManager.playLevelUp();
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
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

  // Phase: Reflection View
  if (phase === 'reflection') {
    return (
      <div
        className={`mentor-reflection-container ${
          isTransitioning ? 'anim-reflection-exit' : 'anim-reflection-enter'
        }`}
      >
        <div className="reflection-header">
          <div className="reflection-badge">
            <Sparkles size={16} />
            <span>CHAPTER 02 REFLECTION • MENTOR INTERVIEW</span>
          </div>
          <h2 className="reflection-title">Wisdom on Real-World Creativity & Mentorship</h2>
          <p className="reflection-subtitle">
            Personal interview with {customMentorName} ({customMentorTitle})
          </p>
        </div>

        <div className="reflection-narrative-card">
          <div className="reflection-quote-icon-wrap">
            <Quote size={24} className="reflection-quote-svg" />
          </div>
          <div className="reflection-text-paragraphs">
            <p>
              From the interview with my mom, I learned why creativity is valuable in the real world and in the business world. She explained how she used creativity in her time at P&G and why it is important to employers and clients. My mom truly is a mentor in my life, and it was interesting to hear her perspective about her experience with creativity. I will keep this in mind for all of the work I produce in the future.
            </p>
          </div>
        </div>

        {/* In-Card Navigation Controls */}
        <div className="reflection-actions-footer">
          <button
            type="button"
            className="btn-back-to-attributes"
            onClick={onGoToInterview}
            title="Return to the Video Call recording"
          >
            <RotateCcw size={15} />
            <span>Review Video Interview</span>
          </button>

          {onProceedToNextChapter && (
            <button
              type="button"
              className="btn-proceed-next-chapter"
              onClick={onProceedToNextChapter}
              title="Advance to Chapter 3: Rube Goldberg"
            >
              <span>Next Chapter: Rube Goldberg</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mentor-zoom-experience ${
        isTransitioning ? 'anim-attributes-exit' : 'anim-attributes-enter'
      }`}
    >
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
                <span>REC 00:24:18</span>
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
              <div
                className={`mentor-video-tile ${activeQuestionId ? 'speaking' : ''} ${
                  isPlaying ? 'video-playing' : ''
                }`}
              >
                {activeQuestion?.videoUrl ? (
                  /* Active HTML5 Video Player inside Meeting Tile */
                  <div className="webcam-video-wrapper">
                    <video
                      ref={videoRef}
                      key={activeQuestion.videoUrl}
                      src={activeQuestion.videoUrl}
                      className="mentor-webcam-feed"
                      playsInline
                      muted={isVideoMuted}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={handleVideoEnded}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onClick={togglePlayPause}
                    />

                    {/* Compact In-Tile Video Controls Overlay */}
                    <div className="webcam-video-controls-overlay">
                      <button
                        type="button"
                        className="video-ctrl-btn play-pause-btn"
                        onClick={togglePlayPause}
                        title={isPlaying ? 'Pause video' : 'Play video'}
                      >
                        {isPlaying ? (
                          <Pause size={13} fill="currentColor" />
                        ) : (
                          <Play size={13} fill="currentColor" />
                        )}
                      </button>

                      <span className="video-time-readout">
                        {formatTime(currentTime)} / {formatTime(duration || 24)}
                      </span>

                      <input
                        type="range"
                        min="0"
                        max={duration || 24}
                        step="0.1"
                        value={currentTime}
                        onChange={handleSeek}
                        className="video-timeline-scrubber"
                        aria-label="Video scrubber"
                      />

                      <button
                        type="button"
                        className={`video-ctrl-btn ${isVideoMuted ? 'muted' : ''}`}
                        onClick={toggleVideoMute}
                        title={isVideoMuted ? 'Unmute video audio' : 'Mute video audio'}
                      >
                        {isVideoMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>

                      <button
                        type="button"
                        className="video-ctrl-btn"
                        onClick={handleReplayVideo}
                        title="Replay video"
                      >
                        <RotateCcw size={13} />
                      </button>
                    </div>

                    {/* Video Completion Toast */}
                    {videoEnded && (
                      <div className="video-completed-banner">
                        <CheckCircle2 size={18} className="check-gold" />
                        <span>Video Answer Complete (+{activeQuestion.insightPoints} Pts)</span>
                        <button
                          type="button"
                          className="btn-replay-pill"
                          onClick={handleReplayVideo}
                        >
                          <RotateCcw size={12} />
                          <span>Replay</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standby Photo / Simulated Webcam Feed */
                  <>
                    <img
                      src={assetUrl('/topics/mentor-zoom.jpg')}
                      alt={customMentorName}
                      className="mentor-webcam-feed"
                    />
                    <div className="webcam-lighting-layer" />
                  </>
                )}

                {/* Top Left Speaker Badge */}
                <div className="speaker-name-badge">
                  <span className={`mentor-audio-wave ${isPlaying ? 'animated' : ''}`}>
                    <span className="bar b1" />
                    <span className="bar b2" />
                    <span className="bar b3" />
                  </span>
                  <span className="mentor-name-text">
                    {customMentorName}{' '}
                    {activeQuestion
                      ? isPlaying
                        ? `(Answering: ${activeQuestion.shortTitle})`
                        : `(${activeQuestion.shortTitle})`
                      : '(Listening)'}
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

                {!activeQuestion && (
                  <div className="zoom-call-prompt-hint">
                    <span>👈 Click any interview inquiry to prompt {customMentorName}’s video answer</span>
                  </div>
                )}
              </div>

              {/* Zoom In-Call Toolbar */}
              <div className="zoom-control-bar">
                <div className="control-group">
                  <button
                    className={`tool-icon-btn ${isMuted ? 'muted' : ''}`}
                    onClick={() => setIsMuted(!isMuted)}
                    title={isMuted ? 'Unmute your microphone' : 'Mute your microphone'}
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
                  <span>INTERACTIVE INTERVIEW QUESTIONS • PROMPT VIDEO ANSWER</span>
                </div>
                <p className="tree-instruction">
                  Click a question below to prompt Linda. Questions tagged with <strong>🎥 Video Answer</strong> stream authentic interview footage directly inside the video meeting.
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
                      className={`dialogue-card ${isActive ? 'active' : ''} ${
                        isUnlocked ? 'unlocked' : ''
                      }`}
                      onClick={() => handleSelectQuestion(q)}
                    >
                      <div className="card-top-row">
                        <span className="card-q-number">0{idx + 1}</span>
                        <span className="card-theme-tag">{q.tag}</span>

                        {q.hasVideo && (
                          <span className="video-answer-tag">
                            <Film size={11} />
                            <span>Video Answer ({q.duration})</span>
                          </span>
                        )}

                        <span className={`points-badge ${isUnlocked ? 'earned' : ''}`}>
                          {isUnlocked
                            ? `+${q.insightPoints} Pts Unlocked`
                            : `+${q.insightPoints} Pts`}
                        </span>
                      </div>

                      <div className="card-title-row">
                        <h4 className="dialogue-question-title">{q.question}</h4>
                        {isActive && isPlaying && (
                          <span className="now-playing-pill">
                            <span className="live-dot blink" />
                            <span>Playing in Call</span>
                          </span>
                        )}
                      </div>
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
                    <h4>🎉 Interview Completed (100 / 100 Insight Points)</h4>
                    <p>
                      You unlocked all 4 wisdom inquiries with {customMentorName}. The <strong>Next</strong> button is now unlocked to continue to the reflection.
                    </p>
                  </div>
                  {onGoToReflection && (
                    <button
                      type="button"
                      className="btn-continue-reflection-pill"
                      onClick={onGoToReflection}
                      title="Proceed to Chapter 2 Reflection"
                    >
                      <span>Continue to Reflection</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
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
