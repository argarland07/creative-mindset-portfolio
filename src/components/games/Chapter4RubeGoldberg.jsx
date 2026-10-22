import { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Users,
  Wrench,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Flame,
  Award,
  Edit3,
  Film,
  Upload,
  Video
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { assetUrl } from '../../utils/assetUrl';

export default function Chapter4RubeGoldberg({
  topic,
  onUpdateTopicData,
  onCompleteSection
}) {
  const defaultSteps = [
    {
      id: 1,
      name: 'Stage 1: The Incline Ramp',
      mechanism: 'Gravity Acceleration Chute',
      member: 'Maya S. (Structural Design)',
      actionText: 'Steel marble releases and accelerates down the 35° wooden incline.',
      failure: 'The marble gained excessive momentum and flew off the track curve on 6 out of 10 runs.',
      pivot: 'Lined the track edges with micro-felt tape to dampen bounce and added custom banked side-rails.',
      soundType: 'marble'
    },
    {
      id: 2,
      name: 'Stage 2: The Domino Cascade',
      mechanism: 'Kinetic Momentum Transfer',
      member: 'Leo T. (Kinetic Spacing)',
      actionText: 'Marble strikes the lead domino, triggering a cascading chain of 6 weighted tiles.',
      failure: 'On the slick seminar table, Domino #3 slipped backward rather than toppling forward into #4.',
      pivot: 'Anchored textured sandpaper footing beneath the dominoes to guarantee forward kinetic transfer.',
      soundType: 'domino'
    },
    {
      id: 3,
      name: 'Stage 3: The Pulley & Counterweight',
      mechanism: 'Mechanical Advantage Hoist',
      member: 'Jordan K. (Mechanical Rigging)',
      actionText: 'Final domino pushes a counterweight off the platform, hoisting the tension line.',
      failure: 'The counterweight stalled halfway because nylon cord friction overcame gravitational pull.',
      pivot: 'Switched to a dual-bearing miniature pulley wheel and calibrated mass with three steel washers (+22g).',
      soundType: 'pulley'
    },
    {
      id: 4,
      name: 'Stage 4: The Seesaw Lever Strike',
      mechanism: 'Angular Velocity Amplifier',
      member: 'Sam P. (Leverage & Fulcrum)',
      actionText: 'Falling weight strikes the short lever arm, whipping the needle striker upward at high speed.',
      failure: 'The wooden fulcrum cracked under high impact stress during test run #8.',
      pivot: 'Reinforced the pivot axle with an aluminum sleeve and added a rubber buffer to absorb excess shock.',
      soundType: 'lever'
    },
    {
      id: 5,
      name: 'Stage 5: The Grand Finale (Pop & Confetti)',
      mechanism: 'Target Trigger & Celebration',
      member: 'Whole Team (All 4 Members)',
      actionText: 'Needle punctures the party balloon, releasing colorful confetti and raising the victory banner!',
      failure: '19 failed attempts in a row before all 5 stages synchronized in continuous harmony.',
      pivot: 'Maintained collaborative morale by treating every failure as data. Run #20 was flawless perfection!',
      soundType: 'balloon'
    }
  ];

  const steps = topic.rubeSteps || defaultSteps;

  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0 = ready, 1 to 5 = active stage
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  // Multi-clip video iteration state
  const defaultClips = [
    {
      id: 1,
      title: 'Attempt #1: The Incline & Marble Release',
      stageName: 'Stage 1-2 Calibration',
      src: assetUrl('/topics/rube-goldberg/clip-1.mp4'),
      fileName: 'clip-1.mp4',
      failureNote: 'The marble gained excessive momentum and jumped off the curve.'
    },
    {
      id: 2,
      title: 'Attempt #2: Domino Cascade & Friction Test',
      stageName: 'Stage 3 Calibration',
      src: assetUrl('/topics/rube-goldberg/clip-2.mp4'),
      fileName: 'clip-2.mp4',
      failureNote: 'Domino #3 slipped backward on the slick tabletop rather than toppling forward.'
    },
    {
      id: 3,
      title: 'Attempt #3: Pulley & Counterweight Tension',
      stageName: 'Stage 4 Calibration',
      src: assetUrl('/topics/rube-goldberg/clip-3.mp4'),
      fileName: 'clip-3.mp4',
      failureNote: 'Friction in the nylon cord stalled the counterweight halfway.'
    },
    {
      id: 4,
      title: 'Run #20: Full 5-Stage Synchronization (Finale)',
      stageName: 'Complete 5-Stage Chain Reaction',
      src: assetUrl('/topics/rube-goldberg/clip-4.mp4'),
      fileName: 'clip-4.mp4',
      isFinal: true
    }
  ];

  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'video'
  const [clips, setClips] = useState(defaultClips);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [clipEnded, setClipEnded] = useState(false);
  const [videoErrors, setVideoErrors] = useState({});
  const [hasFinishedAllClips, setHasFinishedAllClips] = useState(false);
  const videoRef = useRef(null);

  const currentClip = clips[currentClipIndex] || clips[0];
  const isLastClip = currentClipIndex === clips.length - 1;

  const handleClipEnded = () => {
    setClipEnded(true);
    soundManager.playClick();
    if (isLastClip) {
      setHasFinishedAllClips(true);
      soundManager.playLevelUp();
      if (onCompleteSection) {
        onCompleteSection(topic.id);
      }
    }
  };

  const handleReadjustAndTryAgain = () => {
    soundManager.playClick();
    if (currentClipIndex < clips.length - 1) {
      const nextIdx = currentClipIndex + 1;
      setCurrentClipIndex(nextIdx);
      setClipEnded(false);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }, 150);
    } else {
      setHasFinishedAllClips(true);
      if (onCompleteSection) {
        onCompleteSection(topic.id);
      }
    }
  };

  const handleRestartClips = () => {
    soundManager.playClick();
    setCurrentClipIndex(0);
    setClipEnded(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 150);
  };

  const handleSelectClip = (idx) => {
    soundManager.playClick();
    setCurrentClipIndex(idx);
    setClipEnded(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 150);
  };

  const handleUploadClips = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      soundManager.playClick();
      const newClips = files.map((file, idx) => ({
        id: idx + 1,
        title: idx === files.length - 1 ? `Run #${idx + 1}: Final Run` : `Attempt #${idx + 1}: Test Clip`,
        stageName: `Clip ${idx + 1}`,
        src: URL.createObjectURL(file),
        fileName: file.name,
        isFinal: idx === files.length - 1,
        failureNote: idx === files.length - 1 ? null : `Attempt #${idx + 1} test complete. Calibrating mechanisms...`
      }));
      setClips(newClips);
      setCurrentClipIndex(0);
      setClipEnded(false);
      setHasFinishedAllClips(false);
      setVideoErrors({});
      if (onCompleteSection) {
        onCompleteSection(topic.id);
      }
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }, 150);
    }
  };

  const handleVideoError = (clipId) => {
    setVideoErrors((prev) => ({ ...prev, [clipId]: true }));
  };

  const activeStep = steps[Math.max(0, currentStepIndex - 1)];
  const timerRef = useRef(null);

  // Play sound for current step
  const playStepSound = (stepNum) => {
    if (stepNum === 1) soundManager.playMarbleRoll();
    else if (stepNum === 2) soundManager.playDominoTopple();
    else if (stepNum === 3) soundManager.playPulleySwoosh();
    else if (stepNum === 4) soundManager.playDialogueSelect();
    else if (stepNum === 5) {
      soundManager.playBalloonPop();
      setConfettiActive(true);
    }
  };

  const handleStartChainReaction = () => {
    setIsRunning(true);
    setIsCompleted(false);
    setConfettiActive(false);
    setCurrentStepIndex(1);
    playStepSound(1);
  };

  // Automated step-by-step reaction timer with educational pause
  useEffect(() => {
    if (!isRunning) return;

    if (currentStepIndex > 0 && currentStepIndex < steps.length) {
      // Pause 2.8 seconds at each step so the viewer can observe the failure/pivot
      timerRef.current = setTimeout(() => {
        const nextStep = currentStepIndex + 1;
        setCurrentStepIndex(nextStep);
        playStepSound(nextStep);
      }, 2800);
    } else if (currentStepIndex >= steps.length) {
      setIsRunning(false);
      setIsCompleted(true);
      if (onCompleteSection) {
        onCompleteSection(topic.id);
      }
    }

    return () => clearTimeout(timerRef.current);
  }, [isRunning, currentStepIndex, steps.length]);

  const handleResetMachine = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setConfettiActive(false);
    soundManager.playClick();
  };

  const handleManualStep = (stepIdx) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setCurrentStepIndex(stepIdx);
    playStepSound(stepIdx);
    if (stepIdx === steps.length) setIsCompleted(true);
  };

  return (
    <div className="rube-goldberg-engine">
      {/* Top Machine Status Bar */}
      <div className="rube-header-bar">
        <div className="rube-title-group">
          <span className="rube-badge">PHYSICS SIMULATION & DOCUMENTATION • CHAPTER 04</span>
          <h2 className="rube-heading">Chain-Reaction Engine: "The Domino Effect"</h2>
          <p className="rube-subheading">
            {activeTab === 'simulation'
              ? 'Click “Release Ball” to trigger the multi-stage machine. Each step pauses to spotlight a teammate\'s contribution and a real failure we overcame.'
              : 'Watch the live physical test run recorded in the studio, documenting our 5-stage mechanical chain reaction in real motion.'}
          </p>
        </div>

        {/* View Switcher: Simulation vs Real Video */}
        <div className="rube-view-switcher">
          <button
            type="button"
            className={`rube-tab-btn ${activeTab === 'simulation' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setActiveTab('simulation');
            }}
          >
            <Wrench size={14} />
            <span>Blueprint Simulation</span>
          </button>

          <button
            type="button"
            className={`rube-tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setActiveTab('video');
            }}
          >
            <Film size={14} />
            <span>Real Machine Run Video</span>
            <span className="tab-pill-badge">Video</span>
          </button>
        </div>

        {activeTab === 'simulation' && (
          <div className="rube-machine-status">
            <div className="run-counter-box">
              <span className="counter-label">TEST ATTEMPTS</span>
              <span className="counter-num">Run #20 (Success)</span>
            </div>

            <button
              className={`release-ball-btn ${isRunning ? 'running' : ''}`}
              onClick={currentStepIndex === 0 ? handleStartChainReaction : handleResetMachine}
            >
              {currentStepIndex === 0 ? (
                <>
                  <Play size={16} fill="currentColor" />
                  <span>RELEASE BALL</span>
                </>
              ) : (
                <>
                  <RotateCcw size={16} />
                  <span>RESET MACHINE</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Main Machine Grid: Visual Cascade on Left, Technical Spotlight on Right */}
      {activeTab === 'simulation' ? (
        <>
          <div className="rube-arena-grid">
        {/* Left Column: Interactive Visual Physics Canvas */}
        <div className="rube-visual-canvas">
          <div className="machine-blueprint-frame">
            {/* Stage 1 Visual: Incline Ramp & Marble */}
            <div className={`contraption-node node-1 ${currentStepIndex >= 1 ? 'active' : ''}`}>
              <div className="stage-num-tag">01</div>
              <div className="ramp-structure">
                <div
                  className={`marble-ball ${currentStepIndex >= 1 ? 'rolled' : ''}`}
                  title="Steel Marble"
                />
                <div className="ramp-line" />
              </div>
              <span className="node-caption">1. Gravity Ramp</span>
            </div>

            {/* Connector Arrow 1 */}
            <div className={`transfer-arrow ${currentStepIndex >= 1 ? 'flowing' : ''}`}>➔</div>

            {/* Stage 2 Visual: Dominoes */}
            <div className={`contraption-node node-2 ${currentStepIndex >= 2 ? 'active' : ''}`}>
              <div className="stage-num-tag">02</div>
              <div className="domino-rack">
                {[1, 2, 3, 4, 5].map((d) => (
                  <div
                    key={d}
                    className={`domino-tile ${currentStepIndex >= 2 ? 'fallen' : ''}`}
                    style={{ transitionDelay: `${d * 0.08}s` }}
                  />
                ))}
              </div>
              <span className="node-caption">2. Domino Cascade</span>
            </div>

            {/* Connector Arrow 2 */}
            <div className={`transfer-arrow ${currentStepIndex >= 2 ? 'flowing' : ''}`}>➔</div>

            {/* Stage 3 Visual: Pulley & Weight */}
            <div className={`contraption-node node-3 ${currentStepIndex >= 3 ? 'active' : ''}`}>
              <div className="stage-num-tag">03</div>
              <div className="pulley-system">
                <div className={`pulley-wheel ${currentStepIndex >= 3 ? 'spinning' : ''}`} />
                <div className="pulley-cord" />
                <div className={`pulley-weight-left ${currentStepIndex >= 3 ? 'dropped' : ''}`}>
                  <span>100g</span>
                </div>
                <div className={`pulley-weight-right ${currentStepIndex >= 3 ? 'lifted' : ''}`}>
                  <span>Gate</span>
                </div>
              </div>
              <span className="node-caption">3. Pulley Hoist</span>
            </div>

            {/* Connector Arrow 3 */}
            <div className={`transfer-arrow ${currentStepIndex >= 3 ? 'flowing' : ''}`}>➔</div>

            {/* Stage 4 Visual: Seesaw Lever */}
            <div className={`contraption-node node-4 ${currentStepIndex >= 4 ? 'active' : ''}`}>
              <div className="stage-num-tag">04</div>
              <div className="seesaw-apparatus">
                <div className="fulcrum-pivot" />
                <div className={`seesaw-beam ${currentStepIndex >= 4 ? 'tilted' : ''}`}>
                  <div className="striker-needle" />
                </div>
              </div>
              <span className="node-caption">4. Lever Seesaw</span>
            </div>

            {/* Connector Arrow 4 */}
            <div className={`transfer-arrow ${currentStepIndex >= 4 ? 'flowing' : ''}`}>➔</div>

            {/* Stage 5 Visual: Target Balloon & Victory Banner */}
            <div className={`contraption-node node-5 ${currentStepIndex >= 5 ? 'active' : ''}`}>
              <div className="stage-num-tag">05</div>
              <div className="balloon-target">
                {!isCompleted ? (
                  <div className={`balloon-body ${currentStepIndex >= 4 ? 'threatened' : ''}`}>
                    🎈
                  </div>
                ) : (
                  <div className="popped-balloon-burst">
                    <span className="pop-flash">💥 POP!</span>
                    <span className="victory-cap">🎓 SUCCESS!</span>
                  </div>
                )}
              </div>
              <span className="node-caption">5. Final Pop</span>
            </div>

            {/* Confetti Particle Overlay on Completion */}
            {confettiActive && (
              <div className="confetti-shower">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span
                    key={i}
                    className="confetti-bit"
                    style={{
                      left: `${(i * 3.3) % 100}%`,
                      animationDelay: `${(i % 10) * 0.1}s`,
                      backgroundColor: ['#f43f5e', '#fbbf24', '#38bdf8', '#34d399', '#a855f7'][i % 5]
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stepper Navigation Track below Visual */}
          <div className="rube-step-indicators">
            <span className="step-track-label">Inspect Stages:</span>
            {steps.map((st, idx) => (
              <button
                key={st.id}
                className={`rube-pill-btn ${currentStepIndex === st.id ? 'active' : ''} ${currentStepIndex > st.id ? 'passed' : ''}`}
                onClick={() => handleManualStep(st.id)}
              >
                <span>0{st.id}</span>
                <span className="btn-st-name">{st.name.split(':')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic Spotlight & Technical Breakdown */}
        <div className="rube-spotlight-column">
          {currentStepIndex === 0 ? (
            /* Standby State */
            <div className="rube-standby-card">
              <div className="standby-icon-wrap">
                <Flame size={32} className="standby-icon" />
              </div>
              <h3 className="standby-title">Machine Primed & Ready</h3>
              <p className="standby-text">
                Rube Goldberg machines are the ultimate exercise in collaborative engineering: one person's output becomes the next person's input.
              </p>
              <div className="standby-prompt">
                <button
                  className="start-hero-btn"
                  onClick={handleStartChainReaction}
                >
                  <Play size={16} fill="currentColor" />
                  <span>Release Ball & Run Reaction</span>
                </button>
              </div>
              <div className="team-credits-preview">
                <Users size={14} />
                <span>Team: Maya S., Leo T., Jordan K., Sam P.</span>
              </div>
            </div>
          ) : (
            /* Active Stage Spotlight Card */
            <div className="rube-active-spotlight-card">
              {/* Header */}
              <div className="spotlight-top-meta">
                <div className="stage-badge-wrap">
                  <span className="stage-badge-number">STAGE 0{activeStep.id} OF 05</span>
                  <span className="stage-mechanism-pill">{activeStep.mechanism}</span>
                </div>
                <div className="contributor-pill">
                  <Users size={12} />
                  <span>{activeStep.member}</span>
                </div>
              </div>

              <h3 className="spotlight-stage-title">{activeStep.name}</h3>
              <p className="spotlight-action-desc">{activeStep.actionText}</p>

              {/* The Technical Failure Box */}
              <div className="failure-pivot-container">
                <div className="callout-block failure-block">
                  <div className="block-header">
                    <AlertTriangle size={15} className="failure-icon" />
                    <span>Technical Failure Encountered:</span>
                  </div>
                  <p className="block-body">{activeStep.failure}</p>
                </div>

                <div className="callout-block pivot-block">
                  <div className="block-header">
                    <Wrench size={15} className="pivot-icon" />
                    <span>Iterative Pivot & Fix:</span>
                  </div>
                  <p className="block-body">{activeStep.pivot}</p>
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div className="spotlight-controls-footer">
                <button
                  className="step-btn"
                  onClick={() => handleManualStep(Math.max(1, currentStepIndex - 1))}
                  disabled={currentStepIndex <= 1}
                >
                  <ChevronLeft size={16} />
                  <span>Prev Stage</span>
                </button>

                <span className="stage-counter-txt">
                  {isRunning ? 'Cascading...' : `Stage ${currentStepIndex} of 5`}
                </span>

                <button
                  className="step-btn next"
                  onClick={() => handleManualStep(Math.min(5, currentStepIndex + 1))}
                  disabled={currentStepIndex >= 5}
                >
                  <span>Next Stage</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Victory Summary Box on Completion */}
          {isCompleted && (
            <div className="rube-victory-summary">
              <Award size={22} className="victory-icon" />
              <div>
                <h4>🎉 Reaction Complete (100% Chain Synchronization)</h4>
                <p>
                  “When you treat iteration as play rather than performance, frustration turns into infectious momentum.”
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick link banner to switch to video */}
      <div className="rube-video-callout-strip" onClick={() => setActiveTab('video')}>
        <div className="callout-left">
          <div className="callout-icon-circle">
            <Film size={20} />
          </div>
          <div className="callout-text">
            <h4 className="callout-heading">Recorded Live Video Documentation</h4>
            <p className="callout-desc">
              Switch to Video Mode to watch Maya, Leo, Jordan, and Sam's actual physical machine in motion.
            </p>
          </div>
        </div>
        <button className="btn-go-video">
          <span>Watch Live Video</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </>
  ) : (
    /* Mode 2: Multi-Clip Iterative Test Run Video Theater */
    <div className="rube-video-theater">
      {/* Clip Stepper Header */}
      <div className="clip-stepper-header">
        <div className="stepper-meta-left">
          <span className="stepper-title">ITERATIVE ATTEMPTS SEQUENCE:</span>
          <span className="stepper-status-chip">
            Clip {currentClipIndex + 1} of {clips.length}
          </span>
        </div>
        <div className="clip-chips-list">
          {clips.map((clip, idx) => {
            const isFinished = idx < currentClipIndex || hasFinishedAllClips;
            const isActive = idx === currentClipIndex;

            return (
              <button
                key={clip.id}
                type="button"
                className={`clip-chip ${isActive ? 'active' : ''} ${isFinished ? 'completed' : ''}`}
                onClick={() => handleSelectClip(idx)}
                title={`Jump to ${clip.title}`}
              >
                <span className="chip-step-num">
                  {isFinished ? <CheckCircle2 size={12} /> : `0${idx + 1}`}
                </span>
                <span className="chip-step-name">
                  {clip.isFinal ? 'Finale (Run #20)' : `Attempt #${idx + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="video-player-container">
        {!videoErrors[currentClip.id] ? (
          <video
            key={currentClip.src}
            ref={videoRef}
            src={currentClip.src}
            controls
            playsInline
            autoPlay
            className="rube-run-video-player"
            onPlay={() => {
              if (onCompleteSection) onCompleteSection(topic.id);
            }}
            onEnded={handleClipEnded}
            onError={() => handleVideoError(currentClip.id)}
          />
        ) : (
          <div className="video-placeholder-card">
            <div className="placeholder-icon-wrap">
              <Film size={44} className="film-icon" />
            </div>
            <h3 className="placeholder-heading">
              {currentClip.title}
            </h3>
            <p className="placeholder-instruction">
              Place this video clip in your project at:
              <br />
              <code className="placeholder-path-code">
                public/topics/rube-goldberg/clip-{currentClip.id}.mp4
              </code>
            </p>
            <p className="placeholder-sub">
              Or pick your local video clip files from your computer to test right now:
            </p>
            <div className="placeholder-btn-group">
              <label className="btn-browse-file-cta">
                <Upload size={16} />
                <span>Select Video File(s) from Computer</span>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleUploadClips}
                  hidden
                />
              </label>
              <button
                type="button"
                className="btn-simulate-next"
                onClick={handleClipEnded}
                title="Test the 'readjust and try again' button"
              >
                Simulate Clip Ended ➔
              </button>
            </div>
          </div>
        )}

        {/* Readjust and Try Again Overlay when Clip Ends */}
        {clipEnded && (
          <div className="clip-ended-overlay">
            {!isLastClip ? (
              <div className="readjust-modal-card">
                <div className="readjust-icon-wrap">
                  <Wrench size={32} className="readjust-wrench-icon" />
                </div>
                <span className="readjust-status-tag">
                  ATTEMPT #{currentClipIndex + 1} FINISHED
                </span>
                <h3 className="readjust-title">
                  {currentClip.failureNote || 'Mechanism slipped — learning from this attempt!'}
                </h3>
                <p className="readjust-instruction">
                  Every failure gave our team physical data on how to calibrate the next stage.
                </p>
                <button
                  type="button"
                  className="btn-readjust-action"
                  onClick={handleReadjustAndTryAgain}
                >
                  <RotateCcw size={16} />
                  <span>readjust and try again</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <div className="readjust-modal-card finale-card">
                <div className="readjust-icon-wrap victory">
                  <Award size={36} className="readjust-award-icon" />
                </div>
                <span className="readjust-status-tag success">
                  FLAWLESS SYNCHRONIZATION ACHIEVED!
                </span>
                <h3 className="readjust-title">
                  Run #20 Complete — 100% Success!
                </h3>
                <p className="readjust-instruction">
                  All 5 stages linked and synchronized without a single stall. Balloon popped and victory achieved!
                </p>
                <div className="finale-buttons-row">
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

      {/* Video Metadata & Controls Bar */}
      <div className="video-meta-bar">
        <div className="video-info-left">
          <div className="video-badge-row">
            <span className="video-tag-badge">
              CLIP {currentClipIndex + 1} OF {clips.length}
            </span>
            <span className="video-length-badge">{currentClip.stageName}</span>
          </div>
          <h4 className="video-title-text">{currentClip.title}</h4>
          <p className="video-desc-text">
            {currentClip.subtitle}
            <span className="active-file-indicator"> • Path: public/topics/rube-goldberg/clip-{currentClip.id}.mp4</span>
          </p>
        </div>

        <div className="video-actions-right">
          <label className="btn-change-video-btn" title="Choose local video clips from computer">
            <Upload size={14} />
            <span>Select Local Video Clips</span>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleUploadClips}
              hidden
            />
          </label>
        </div>
      </div>
    </div>
  )}
</div>
  );
}
