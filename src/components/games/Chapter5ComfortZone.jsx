import { useState } from 'react';
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
  // Interaction phase: 'map' | 'unlocked'
  const [phase, setPhase] = useState('map');

  const activeStranger = strangers.find((s) => s.id === activeStrangerId) || null;

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

  // Select a stranger from the map: immediately view question & answer
  const handleSelectStranger = (id) => {
    soundManager.playClick();
    setActiveStrangerId(id);
    setPhase('unlocked');

    setUnlockedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      if (next.length >= strangers.length) {
        soundManager.playLevelUp();
        if (onCompleteSection) {
          onCompleteSection(topic.id);
        }
      }
      return next;
    });
  };

  // Reset progress
  const handleReset = () => {
    soundManager.playClick();
    setUnlockedIds([]);
    setPhase('map');
    setActiveStrangerId(null);
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
            Click on people across campus to see the questions I asked and their answers.
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
                      {isUnlocked ? '✓ Connected' : 'Approach NPC'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="map-footer-guide">
            <span className="map-instruction">
              💡 <strong>Action:</strong> Click on any person across campus to view the conversation.
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
              <h3>Choose a Person to View</h3>
              <p>
                Click any person on the campus map to see the question I asked and their answer.
              </p>
              <div className="idle-quick-stats">
                <div className="stat-pill">
                  <strong>{strangers.length}</strong> People Met
                </div>
                <div className="stat-pill">
                  <strong>{unlockedIds.length} / {strangers.length}</strong> Viewed
                </div>
              </div>
            </div>
          )}

          {/* State 2: Unlocked Story & Conversation Card */}
          {phase === 'unlocked' && activeStranger && (
            <div className="panel-unlocked-card">
              {/* Photo & Identity */}
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
                  <p className="stranger-role-text">{activeStranger.role}</p>
                  <p className="stranger-loc-text">
                    <MapPin size={12} /> {activeStranger.location}
                  </p>
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
