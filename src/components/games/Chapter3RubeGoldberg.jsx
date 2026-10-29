import { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Sparkles,
  ChevronRight,
  Award,
  Play,
  Quote
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { assetUrl } from '../../utils/assetUrl';

// 5 videos overall (clip-4 removed)
const DEFAULT_CLIPS = [
  {
    id: 1,
    title: 'Attempt #1',
    src: assetUrl('/topics/rube-goldberg/clip-1.mp4')
  },
  {
    id: 2,
    title: 'Attempt #2',
    src: assetUrl('/topics/rube-goldberg/clip-2.mp4')
  },
  {
    id: 3,
    title: 'Attempt #3',
    src: assetUrl('/topics/rube-goldberg/clip-3.mp4')
  },
  {
    id: 4,
    title: 'Attempt #4',
    src: assetUrl('/topics/rube-goldberg/clip-5.mp4')
  },
  {
    id: 5,
    title: 'Run #20 (Successful Finale)',
    src: assetUrl('/topics/rube-goldberg/clip-6.mp4'),
    isFinal: true
  }
];

export default function Chapter3RubeGoldberg({
  topic,
  onCompleteSection,
  phase = 'videos', // 'videos' | 'reflection'
  isTransitioning = false,
  onGoToReflection,
  onGoToVideos,
  onProceedToNextChapter
}) {
  const [clips] = useState(DEFAULT_CLIPS);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [clipEnded, setClipEnded] = useState(false);
  const videoRef = useRef(null);

  const currentClip = clips[currentClipIndex] || clips[0];
  const isLastClip = currentClipIndex === clips.length - 1;

  // Autoplay only after the user starts and when switching attempts
  useEffect(() => {
    if (hasStarted && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentClipIndex, hasStarted]);

  const handleStartFirstAttempt = () => {
    soundManager.playClick();
    setHasStarted(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleClipEnded = () => {
    setClipEnded(true);
    soundManager.playClick();
    if (isLastClip) {
      soundManager.playLevelUp();
      if (onCompleteSection) {
        onCompleteSection(topic.id);
      }
    }
  };

  const handleTryAgain = () => {
    soundManager.playClick();
    setClipEnded(false);
    if (currentClipIndex < clips.length - 1) {
      setCurrentClipIndex((prev) => prev + 1);
    } else {
      if (onCompleteSection) {
        onCompleteSection(topic.id);
      }
    }
  };

  const handleRestartClips = () => {
    soundManager.playClick();
    setClipEnded(false);
    setCurrentClipIndex(0);
  };

  // Phase: Reflection View
  if (phase === 'reflection') {
    return (
      <div
        className={`rube-reflection-container ${
          isTransitioning ? 'anim-reflection-exit' : 'anim-reflection-enter'
        }`}
      >
        <div className="reflection-header">
          <div className="reflection-badge">
            <Sparkles size={16} />
            <span>CHAPTER 03 REFLECTION • RUBE GOLDBERG</span>
          </div>
          <h2 className="reflection-title">Iteration, Failure, & Creative Video Editing</h2>
          <p className="reflection-subtitle">
            Personal reflection by Andrew Garland on physical testing, resilience, and video storytelling
          </p>
        </div>

        <div className="reflection-narrative-card">
          <div className="reflection-quote-icon-wrap">
            <Quote size={24} className="reflection-quote-svg" />
          </div>
          <div className="reflection-text-paragraphs">
            <p>
              The Rube Goldberg project taught me a few things about creativity. A more direct concept I learned was about simply trying and failing repeatedly. We had many different attempts, and when things weren&apos;t working out we had to adapt and try something new. We truly had to get creative with how we used our materials to achieve the goal.
            </p>
            <p>
              Another important point I leaned about creativity on this project had to do with the video editing I did. I am pretty pleased with the product of my work as someone who has little experience with video editing, but I had more trouble making a video that connected with viewers. My video was very straightforward, and did not have the fun, creative elements that videos from other groups had. I want to use creativity to be more experimental and thoughtful about the videos I put together in the future.
            </p>
          </div>
        </div>

        {/* In-Card Navigation Controls */}
        <div className="reflection-actions-footer">
          <button
            type="button"
            className="btn-back-to-attributes"
            onClick={onGoToVideos}
            title="Return to the Video Attempts"
          >
            <RotateCcw size={15} />
            <span>Review Video Attempts</span>
          </button>

          {onProceedToNextChapter && (
            <button
              type="button"
              className="btn-proceed-next-chapter"
              onClick={onProceedToNextChapter}
              title="Advance to Chapter 4: Joyous Exploration"
            >
              <span>Next Chapter: Night Photos</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Phase: Videos Journey
  return (
    <div
      className={`rube-videos-experience ${
        isTransitioning ? 'anim-attributes-exit' : 'anim-attributes-enter'
      }`}
    >
      {/* Top Header */}
      <div className="rube-header-bar">
        <div className="rube-title-group">
          <span className="rube-badge">PHYSICS ITERATION & DOCUMENTATION • CHAPTER 03</span>
          <h2 className="rube-heading">Rube Goldberg: Trying, Failing, & Adapting</h2>
          <p className="rube-subheading">
            Watch through our recorded attempts in sequence. When an attempt doesn&apos;t work out, click &ldquo;Try Again&rdquo; to see how we adapted until the final run succeeds!
          </p>
        </div>

        {hasStarted && (
          <div className="rube-attempt-tracker-pill">
            <span className="tracker-dot" />
            <span className="tracker-text">
              {isLastClip ? 'Final Attempt (Run #20)' : `Attempt #${currentClipIndex + 1}`}
            </span>
          </div>
        )}
      </div>

      <div className="rube-video-theater">
        {/* Video Player Container */}
        <div className="video-player-container">
          <video
            key={currentClip.src}
            ref={videoRef}
            src={currentClip.src}
            controls
            playsInline
            className="rube-run-video-player"
            onPlay={() => {
              if (onCompleteSection && isLastClip) {
                onCompleteSection(topic.id);
              }
            }}
            onEnded={handleClipEnded}
          />

          {/* "Ready for first attempt?" Start Card Overlay */}
          {!hasStarted && (
            <div className="ready-start-overlay">
              <div className="ready-start-card">
                <div className="ready-icon-wrap">
                  <Play size={36} className="ready-play-icon" fill="currentColor" />
                </div>
                <span className="ready-status-tag">RUBE GOLDBERG MACHINE</span>
                <h3 className="ready-title">Ready for the First Attempt?</h3>
                <p className="ready-subtitle">
                  Building our physical machine took many test runs. Click below to begin watching our attempts!
                </p>
                <button
                  type="button"
                  className="btn-start-attempts"
                  onClick={handleStartFirstAttempt}
                >
                  <Play size={16} fill="currentColor" />
                  <span>Start Attempt #1</span>
                </button>
              </div>
            </div>
          )}

          {/* Try Again / Next Attempt Overlay when Clip Ends */}
          {hasStarted && clipEnded && (
            <div className="clip-ended-overlay">
              {!isLastClip ? (
                <div className="readjust-modal-card">
                  <div className="readjust-icon-wrap">
                    <RotateCcw size={32} className="readjust-wrench-icon" />
                  </div>
                  <span className="readjust-status-tag">
                    ATTEMPT #{currentClipIndex + 1}
                  </span>
                  <button
                    type="button"
                    className="btn-readjust-action"
                    onClick={handleTryAgain}
                  >
                    <RotateCcw size={16} />
                    <span>Try Again</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="readjust-modal-card finale-card">
                  <div className="readjust-icon-wrap victory">
                    <Award size={36} className="readjust-award-icon" />
                  </div>
                  <span className="readjust-status-tag success">
                    SUCCESSFUL RUN!
                  </span>
                  <h3 className="readjust-title">
                    Run #20 Complete — 100% Success!
                  </h3>
                  <div className="finale-buttons-row">
                    {onGoToReflection && (
                      <button
                        type="button"
                        className="btn-readjust-action"
                        onClick={onGoToReflection}
                      >
                        <Sparkles size={16} />
                        <span>Continue to Reflection</span>
                        <ChevronRight size={18} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-replay-sequence"
                      onClick={handleRestartClips}
                    >
                      <RotateCcw size={15} />
                      <span>Replay From Attempt #1</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
