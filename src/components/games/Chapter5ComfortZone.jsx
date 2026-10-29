import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Compass,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Coffee,
  Palette,
  Train,
  Smile,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Shield,
  Quote,
  ChevronRight
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { assetUrl } from '../../utils/assetUrl';

export default function Chapter5ComfortZone({
  topic,
  onCompleteSection,
  chapterPhase = 'simulator', // 'simulator' | 'reflection'
  isTransitioning = false,
  onGoToReflection,
  onGoToSimulator,
  onProceedToNextChapter
}) {
  const defaultStrangers = [
    {
      id: 'colten',
      name: 'Colten',
      role: 'Fellow Student / Campus Peer',
      location: 'Academic Hallway · Farmer School of Business',
      icon: 'smile',
      coords: { x: '18%', y: '18%' },
      image: assetUrl('/topics/strangers/stranger-colten.jpg'),
      question: '“What is your favorite item you have on you right now?”',
      response: '“My water bottle, I use it all the time.”'
    },
    {
      id: 'alex',
      name: 'Alex',
      role: 'Campus Peer / Fellow Student',
      location: 'Student Lounge & Dining Commons',
      icon: 'smile',
      coords: { x: '50%', y: '16%' },
      image: assetUrl('/topics/strangers/stranger-alex.jpg'),
      question: '“What is something you are proud of that you never get to talk about?”',
      response: '“I’m proud of having good social skills.”'
    },
    {
      id: 'vinney',
      name: 'Vinney',
      role: 'Campus Peer / Fellow Student',
      location: 'Grand Foyer & Colonnade Hallway',
      icon: 'smile',
      coords: { x: '82%', y: '18%' },
      image: assetUrl('/topics/strangers/stranger-vinney.jpg'),
      question: '“What is your favorite item you have on you right now?”',
      response: '“My Apple Watch.”'
    },
    {
      id: 'evy',
      name: 'Evy',
      role: 'Campus Peer / Fellow Student',
      location: 'Career Commons Lounge & Foyer',
      icon: 'smile',
      coords: { x: '22%', y: '40%' },
      image: assetUrl('/topics/strangers/stranger-evy.jpg'),
      question: '“What is a piece of advice you learned that turned out to be very valuable?”',
      response: '“I learned how to be curious and talk to people!”'
    },
    {
      id: 'jackson',
      name: 'Jackson',
      role: 'Campus Peer / Fellow Student',
      location: 'Stairwell Landing & Grand Hall',
      icon: 'smile',
      coords: { x: '50%', y: '38%' },
      image: assetUrl('/topics/strangers/stranger-jackson.jpg'),
      question: '“If you had to give a 10-minute TED Talk right now with zero preparation, what topic would it be on?”',
      response: '“Cologne.”'
    },
    {
      id: 'conner',
      name: 'Conner',
      role: 'Campus Peer / Fellow Student',
      location: 'Student Study Lounge & Hall',
      icon: 'smile',
      coords: { x: '78%', y: '40%' },
      image: assetUrl('/topics/strangers/stranger-conner.jpg'),
      question: '“What is your favorite item you have on you right now?”',
      response: '“My laptop.”'
    },
    {
      id: 'hugo',
      name: 'Hugo',
      role: 'Campus Peer / Fellow Student',
      location: 'Campus Commons & Tech Lounge',
      icon: 'smile',
      coords: { x: '34%', y: '62%' },
      image: assetUrl('/topics/strangers/stranger-hugo.jpg'),
      question: '“What is your favorite item you have on you right now?”',
      response: '“My book.”'
    },
    {
      id: 'josh',
      name: 'Josh',
      role: 'Campus Peer / Fellow Student',
      location: 'Window Lounge · Armstrong Student Center',
      icon: 'smile',
      coords: { x: '66%', y: '62%' },
      image: assetUrl('/topics/strangers/stranger-josh.jpg'),
      question: '“What is a piece of advice you learned that turned out to be very valuable?”',
      response: '“Your habits really make you who you are.”'
    },
    {
      id: 'alex-fitness',
      name: 'Alex',
      role: 'Campus Peer / Fellow Student',
      location: 'Campus Hallway & Gateway Entrance',
      icon: 'smile',
      coords: { x: '18%', y: '84%' },
      image: assetUrl('/topics/strangers/stranger-alex2.jpg'),
      question: '“If you had to give a 10-minute TED Talk right now with zero preparation, what topic would it be on?”',
      response: '“Health and fitness.”'
    },
    {
      id: 'anna-k',
      name: 'Anna K',
      role: 'Campus Peer / Fellow Student',
      location: 'Atrium Lounge · Farmer School of Business',
      icon: 'smile',
      coords: { x: '50%', y: '84%' },
      image: assetUrl('/topics/strangers/stranger-anna.jpg'),
      question: '“What is something you bought that has significantly improved your life?”',
      response: '“My car.”'
    },
    {
      id: 'anna-s',
      name: 'Anna S',
      role: 'Campus Peer / Fellow Student',
      location: 'Quiet Study Parlor & Library Bay',
      icon: 'smile',
      coords: { x: '82%', y: '84%' },
      image: assetUrl('/topics/strangers/stranger-anna-s.jpg'),
      question: '“What is something you’re proud of you never get to talk about?”',
      response: '“I graduated with an associates degree.”'
    }
  ];

  const strangers = topic.strangerData || defaultStrangers;

  // Selected stranger for interaction
  const [activeStrangerId, setActiveStrangerId] = useState(null);
  // Unlocked strangers array
  const [unlockedIds, setUnlockedIds] = useState([]);
  // Interaction phase: 'map' | 'approach' | 'unlocked'
  const [phase, setPhase] = useState('map');

  // Spacebar hold interaction state
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  // Refs for smooth animation frame updates without stale closures
  const holdProgressRef = useRef(0);
  const isHoldingRef = useRef(false);

  const activeStranger = strangers.find((s) => s.id === activeStrangerId) || null;

  // Keep isHolding ref in sync with state
  useEffect(() => {
    isHoldingRef.current = isHolding;
  }, [isHolding]);

  // Handle successfully completing an approach
  const handleApproachComplete = useCallback(() => {
    soundManager.playComfortExpansion();
    setIsHolding(false);
    isHoldingRef.current = false;
    holdProgressRef.current = 0;
    setHoldProgress(0);
    setPhase('unlocked');

    setUnlockedIds((prev) => {
      if (!activeStrangerId || prev.includes(activeStrangerId)) return prev;
      const next = [...prev, activeStrangerId];
      if (next.length >= strangers.length) {
        soundManager.playLevelUp();
        if (onCompleteSection) {
          onCompleteSection(topic.id);
        }
      }
      return next;
    });
  }, [activeStrangerId, onCompleteSection, strangers.length, topic.id]);

  // Global keyboard listeners for holding Spacebar
  useEffect(() => {
    if (phase !== 'approach') return;

    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (!e.repeat && !isHoldingRef.current) {
          setIsHolding(true);
          isHoldingRef.current = true;
          soundManager.playApproach();
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        setIsHolding(false);
        isHoldingRef.current = false;
      }
    };

    const handleBlur = () => {
      setIsHolding(false);
      isHoldingRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [phase]);

  // Continuous animation frame loop to charge / drain hold progress
  useEffect(() => {
    if (phase !== 'approach') return;

    let animId;
    let lastTime = performance.now();
    const APPROACH_DURATION_MS = 1200; // 1.2s to fully approach

    const loop = (currentTime) => {
      const dt = currentTime - lastTime;
      lastTime = currentTime;

      if (isHoldingRef.current) {
        holdProgressRef.current = Math.min(
          100,
          holdProgressRef.current + (dt / APPROACH_DURATION_MS) * 100
        );
        setHoldProgress(holdProgressRef.current);

        if (holdProgressRef.current >= 100) {
          handleApproachComplete();
          return;
        }
      } else if (holdProgressRef.current > 0) {
        holdProgressRef.current = Math.max(
          0,
          holdProgressRef.current - (dt / 320) * 100
        );
        setHoldProgress(holdProgressRef.current);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      holdProgressRef.current = 0;
    };
  }, [phase, handleApproachComplete]);

  // Total comfort zone percentage (starts at 20% baseline, scales to 100%)
  const comfortScore = Math.min(
    100,
    Math.round(20 + (unlockedIds.length / (strangers.length || 1)) * 80)
  );

  // Fear of Rejection index drops as comfort grows
  const rejectionFear = Math.max(
    8,
    Math.round(85 - (unlockedIds.length / (strangers.length || 1)) * 75)
  );

  // Curiosity resonance rating rises
  const curiosityResonance = Math.min(
    99,
    Math.round(45 + (unlockedIds.length / (strangers.length || 1)) * 54)
  );

  // Select a stranger from the map: if already approached, view immediately; otherwise approach!
  const handleSelectStranger = (id) => {
    soundManager.playClick();
    setActiveStrangerId(id);
    if (unlockedIds.includes(id)) {
      setPhase('unlocked');
    } else {
      setPhase('approach');
      setIsHolding(false);
      isHoldingRef.current = false;
      holdProgressRef.current = 0;
      setHoldProgress(0);
    }
  };

  // Reset progress
  const handleReset = () => {
    soundManager.playClick();
    setUnlockedIds([]);
    setPhase('map');
    setActiveStrangerId(null);
    setIsHolding(false);
    isHoldingRef.current = false;
    holdProgressRef.current = 0;
    setHoldProgress(0);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'coffee':
        return <Coffee size={18} />;
      case 'palette':
        return <Palette size={18} />;
      case 'train':
        return <Train size={18} />;
      default:
        return <Smile size={18} />;
    }
  };

  // Phase: Reflection View
  if (chapterPhase === 'reflection') {
    return (
      <div
        className={`strangers-reflection-container ${
          isTransitioning ? 'anim-reflection-exit' : 'anim-reflection-enter'
        }`}
      >
        <div className="reflection-header">
          <div className="reflection-badge">
            <Sparkles size={16} />
            <span>SOCIAL CURIOSITY • REFLECTION</span>
          </div>
          <h2 className="reflection-title">Talking to Strangers & The Courage of Social Curiosity</h2>
          <p className="reflection-subtitle">
            Personal reflection by Andrew Garland on the 5 Dimensions of Curiosity test and stepping outside my comfort zone
          </p>
        </div>

        <div className="reflection-narrative-card">
          <div className="reflection-quote-icon-wrap">
            <Quote size={24} className="reflection-quote-svg" />
          </div>
          <div className="reflection-text-paragraphs">
            <p>
              On our 5 Dimensions of Curiosity test, I got Social Curiosity as my most natural dimension. I spent time thinking about what action I could take for this activity, and decided to do something that I&apos;ve always wanted to do: talk to random people about something.
            </p>
            <p>
              I care a lot about interests, stories, and advice from other people. However, I am pretty introverted, so this activity required some confidence and leaving my comfort zone to complete. But I am glad I did, and although I might not be able to remember what everyone said, I do have photos that show all the people I met.
            </p>
          </div>
        </div>

        {/* In-Card Navigation Controls */}
        <div className="reflection-actions-footer">
          <button
            type="button"
            className="btn-back-to-attributes"
            onClick={onGoToSimulator}
            title="Return to Social Curiosity Simulator"
          >
            <RotateCcw size={15} />
            <span>Review Encounters</span>
          </button>

          {onProceedToNextChapter && (
            <button
              type="button"
              className="btn-proceed-next-chapter"
              onClick={onProceedToNextChapter}
              title="Complete Experience & View Thank You"
            >
              <span>Finish Journey</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="comfort-zone-game-root">
      {/* Top Experience Banner & Stats */}
      <div className="comfort-top-header">
        <div className="comfort-title-col">
          <div className="comfort-badge">
            <Compass size={14} />
            <span>Social Curiosity · Field Experiment</span>
          </div>
          <h2 className="comfort-main-title">Social Curiosity: Talking to Strangers</h2>
          <p className="comfort-subtitle">
            Click on people across campus, then hold down the space bar to approach them and see their answers.
          </p>
        </div>

        {/* Dynamic Dual Gauges */}
        <div className="comfort-gauges-cluster">
          {/* Comfort Zone Expansion Meter */}
          <div className="gauge-card comfort-expansion-gauge">
            <div className="gauge-top">
              <span className="gauge-label">
                <Shield size={14} className="text-cyan" /> Comfort Zone Radius
              </span>
              <span className="gauge-val text-cyan">{comfortScore}%</span>
            </div>
            <div className="gauge-progress-track">
              <div
                className="gauge-fill-cyan"
                style={{ width: `${comfortScore}%` }}
              />
            </div>
            <span className="gauge-sub">
              {unlockedIds.length === strangers.length
                ? '★ Full Social Freedom Unlocked'
                : `Boundary Expanded +${Math.round((unlockedIds.length / strangers.length) * 80)}%`}
            </span>
          </div>

          {/* Rejection Fear Index */}
          <div className="gauge-card fear-index-gauge">
            <div className="gauge-top">
              <span className="gauge-label">
                <AlertTriangle size={14} className="text-rose" /> Rejection Fear
              </span>
              <span className="gauge-val text-rose">{rejectionFear}%</span>
            </div>
            <div className="gauge-progress-track">
              <div
                className="gauge-fill-rose"
                style={{ width: `${rejectionFear}%` }}
              />
            </div>
            <span className="gauge-sub">
              {rejectionFear < 20 ? 'Dissolved into Empathy' : 'Mitigated by Curiosity'}
            </span>
          </div>

          {/* Curiosity Resonance */}
          <div className="gauge-card curiosity-resonance-gauge">
            <div className="gauge-top">
              <span className="gauge-label">
                <Sparkles size={14} className="text-amber" /> Curiosity XP
              </span>
              <span className="gauge-val text-amber">{curiosityResonance} pts</span>
            </div>
            <div className="gauge-progress-track">
              <div
                className="gauge-fill-amber"
                style={{ width: `${curiosityResonance}%` }}
              />
            </div>
            <span className="gauge-sub">
              {unlockedIds.length} of {strangers.length} Encounters Mapped
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Map + Encounter Panel */}
      <div className="comfort-interactive-grid">
        {/* Left Column: Interactive City Street Map */}
        <div className="comfort-map-wrapper">
          <div className="map-glass-header">
            <div className="map-header-left">
              <MapPin size={16} className="text-cyan" />
              <span className="map-title-text">Forsythe Commons · Campus Encounter Map</span>
            </div>
            <div className="map-legend">
              <span className="legend-item">
                <span className="legend-dot dot-unlocked" /> Connected
              </span>
              <span className="legend-item">
                <span className="legend-dot dot-pending" /> Unmet Stranger
              </span>
            </div>
          </div>

          {/* Stylized Street Map Canvas */}
          <div className="city-map-canvas">
            {/* Real Campus Photo Background - Forsythe Commons */}
            <img
              src={assetUrl('/topics/strangers/forsythe-commons-map-bg.jpg')}
              alt="Forsythe Commons - Farmer School of Business"
              className="city-map-bg-photo"
            />
            <div className="city-map-photo-overlay" />

            {/* Ambient Animated Concentric Expansion Rings */}
            <div
              className="comfort-radar-ring ring-1"
              style={{
                transform: `translate(-50%, -50%) scale(${0.4 + (comfortScore / 100) * 0.7})`
              }}
            />
            <div
              className="comfort-radar-ring ring-2"
              style={{
                transform: `translate(-50%, -50%) scale(${0.6 + (comfortScore / 100) * 0.8})`
              }}
            />

            {/* Real Architectural Landmarks */}
            <div className="map-landmark lm-commons">🏛️ Forsythe Commons Hall</div>
            <div className="map-landmark lm-parlor">🛋️ Executive Study Parlor</div>
            <div className="map-landmark lm-colonnade">🏛️ Colonnade Arches</div>
            <div className="map-landmark lm-piano">🎹 Grand Piano Alcove</div>

            {/* Clickable NPC Stranger Pins */}
            {strangers.map((s) => {
              const isUnlocked = unlockedIds.includes(s.id);
              const isSelected = activeStrangerId === s.id;

              return (
                <button
                  key={s.id}
                  className={`map-npc-pin ${isUnlocked ? 'unlocked' : 'pending'} ${
                    isSelected ? 'selected' : ''
                  }`}
                  style={{ left: s.coords.x, top: s.coords.y }}
                  onClick={() => handleSelectStranger(s.id)}
                  title={`Click to interact with ${s.name}`}
                >
                  <div className="pin-radar-pulse" />
                  <div className="pin-icon-circle">
                    {isUnlocked ? <CheckCircle2 size={16} /> : getIcon(s.icon)}
                  </div>
                  <div className="pin-label-tag">
                    <span className="pin-name">{s.name}</span>
                    <span className="pin-status">
                      {isUnlocked ? '✓ Connected' : 'Hold Space'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="map-footer-guide">
            <span className="map-instruction">
              💡 <strong>Action:</strong> Click on any person pin, then hold down <strong>[ SPACEBAR ]</strong> to approach them.
            </span>
          </div>
        </div>

        {/* Right Column: Interaction Encounter Card */}
        <div className="comfort-encounter-panel">
          {/* State 1: Nothing selected yet */}
          {phase === 'map' && (
            <div className="panel-idle-state">
              <div className="idle-compass-ring">
                <Users size={42} className="text-cyan pulse-slow" />
              </div>
              <h3>Choose a Person on Campus</h3>
              <p>
                Click any person pin on the campus map, then hold down the space bar to approach them and hear their story.
              </p>
              <div className="idle-quick-stats">
                <div className="stat-pill">
                  <strong>{strangers.length}</strong> People Met
                </div>
                <div className="stat-pill">
                  <strong>{unlockedIds.length} / {strangers.length}</strong> Approached
                </div>
              </div>
            </div>
          )}

          {/* State 2: Approach Challenge - Hold Spacebar to Approach */}
          {phase === 'approach' && activeStranger && (
            <div className="panel-approach-challenge">
              <div className="approach-target-header">
                <div className="approach-target-badge">
                  <Sparkles size={14} /> Approach Challenge
                </div>
                <h3 className="approach-target-title">
                  Approaching {activeStranger.name}
                </h3>
                <p className="approach-target-hint">
                  Step outside your comfort zone. Hold down the space bar to walk over and break the ice.
                </p>
              </div>

              {/* Approach Preview Photo with dynamic focus */}
              <div className="approach-preview-photo-wrap">
                <img
                  src={activeStranger.image}
                  alt={activeStranger.name}
                  className="approach-preview-photo"
                  style={{
                    filter: `brightness(${0.7 + (holdProgress / 100) * 0.3}) blur(${(1 - holdProgress / 100) * 3}px)`,
                    transform: `scale(${1 + (holdProgress / 100) * 0.05})`
                  }}
                />
                <div className="approach-overlay-gradient" />
                <div className="approach-distance-badge">
                  {holdProgress >= 100
                    ? 'Connected!'
                    : holdProgress > 65
                    ? 'Almost there...'
                    : holdProgress > 25
                    ? 'Walking closer...'
                    : 'Ready to approach'}
                </div>
              </div>

              {/* The Spacebar Hold Action Button */}
              <div className="approach-hold-area">
                <button
                  type="button"
                  className={`btn-hold-spacebar ${isHolding ? 'holding' : ''}`}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setIsHolding(true);
                    isHoldingRef.current = true;
                    soundManager.playApproach();
                  }}
                  onPointerUp={() => {
                    setIsHolding(false);
                    isHoldingRef.current = false;
                  }}
                  onPointerLeave={() => {
                    setIsHolding(false);
                    isHoldingRef.current = false;
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setIsHolding(true);
                    isHoldingRef.current = true;
                    soundManager.playApproach();
                  }}
                  onTouchEnd={() => {
                    setIsHolding(false);
                    isHoldingRef.current = false;
                  }}
                  aria-label="Hold down spacebar or hold this button to approach"
                >
                  <div
                    className="hold-progress-fill"
                    style={{ width: `${holdProgress}%` }}
                  />

                  <div className="hold-button-content">
                    <div className="spacebar-key-visual">
                      <span className="key-cap">SPACEBAR</span>
                    </div>
                    <div className="hold-text-cluster">
                      <span className="hold-main-text">
                        {isHolding ? 'HOLDING... STEPPING FORWARD' : 'HOLD SPACEBAR TO APPROACH'}
                      </span>
                      <span className="hold-sub-text">
                        {holdProgress > 0
                          ? `${Math.round(holdProgress)}% · Closing distance...`
                          : 'Press & hold Space (or hold this button)'}
                      </span>
                    </div>
                  </div>
                </button>
              </div>

              <div className="approach-cancel-row">
                <button
                  type="button"
                  className="btn-cancel-approach"
                  onClick={() => {
                    soundManager.playClick();
                    setPhase('map');
                  }}
                >
                  Choose a different person
                </button>
              </div>
            </div>
          )}

          {/* State 3: Unlocked Story & Conversation Card */}
          {phase === 'unlocked' && activeStranger && (
            <div className="panel-unlocked-card">
              {/* Photo & Name Only - Larger photo, no role or location */}
              <div className="unlocked-identity-strip">
                <div className="stranger-photo-wrap">
                  <img
                    src={activeStranger.image}
                    alt={activeStranger.name}
                    className="stranger-full-photo"
                  />
                </div>
                <div className="stranger-info-meta">
                  <h3 className="stranger-title">{activeStranger.name}</h3>
                </div>
              </div>

              {/* The Exact Question */}
              <div className="conversation-section question-bubble">
                <div className="dialogue-speaker-tag">
                  <MessageSquare size={13} /> The Question I Asked:
                </div>
                <p className="dialogue-text-body">{activeStranger.question}</p>
              </div>

              {/* Their Exact Answer */}
              <div className="conversation-section response-bubble">
                <div className="dialogue-speaker-tag response-tag">
                  <Sparkles size={13} /> {activeStranger.name}’s Answer:
                </div>
                <p className="dialogue-text-body response-quote">
                  {activeStranger.response}
                </p>
              </div>

              {/* Return or Next Stranger Button */}
              <div className="unlocked-actions">
                <button
                  className="btn-return-map"
                  onClick={() => {
                    soundManager.playClick();
                    setPhase('map');
                  }}
                >
                  <ArrowRight size={16} /> Choose Another Person
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Summary & Celebration Banner */}
      {unlockedIds.length === strangers.length && (
        <div className="comfort-mastery-banner">
          <div className="mastery-content">
            <div className="mastery-icon-badge">
              <Sparkles size={28} className="text-amber" />
            </div>
            <div>
              <h4 className="mastery-title">
                All Campus Conversations Viewed!
              </h4>
              <p className="mastery-desc">
                Every person has been spoken with. Click below to continue to the reflection.
              </p>
            </div>
          </div>
          <div className="mastery-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {onGoToReflection && (
              <button
                type="button"
                className="btn-continue-reflection-pill"
                onClick={onGoToReflection}
                title="Proceed to Reflection"
              >
                <span>Continue to Reflection</span>
                <ChevronRight size={15} />
              </button>
            )}
            <button className="btn-reset-simulator" onClick={handleReset}>
              <RotateCcw size={15} /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
