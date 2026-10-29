import { useState, useEffect } from 'react';
import {
  Compass,
  Users,
  MapPin,
  Heart,
  Sparkles,
  Zap,
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
      hesitation: {
        thought:
          '“Approaching another student in the corridor to ask an unexpected personal question felt nerve-wracking. What if he thought it was strange or didn’t want to be bothered?”',
        fearRating: 65,
        heartRate: 110
      },
      approachPrompt: 'Step up, smile, and ask about what he has on him',
      question:
        '“What is your favorite item you have on you right now?”',
      response:
        '“‘My water bottle, I use it all the time.’ He grinned, held up his BlenderBottle, and we shared an instant laugh—such an honest, grounded answer that immediately broke the ice.”',
      takeaway:
        'Simple, lighthearted questions about everyday items break through social walls faster than rehearsed speeches.',
      expansionBoost: 9,
      xp: 150
    },
    {
      id: 'alex',
      name: 'Alex',
      role: 'Campus Peer / Fellow Student',
      location: 'Student Lounge & Dining Commons',
      icon: 'smile',
      coords: { x: '50%', y: '16%' },
      image: assetUrl('/topics/strangers/stranger-alex.jpg'),
      hesitation: {
        thought:
          '“Asking someone what they are privately proud of is vulnerable. What if he feels put on the spot or brushes it off?”',
        fearRating: 74,
        heartRate: 118
      },
      approachPrompt: 'Take a seat nearby, smile, and ask with genuine curiosity',
      question:
        '“What is something you are proud of that you never get to talk about?”',
      response:
        '“‘I’m proud of having good social skills.’ He smiled with pure warmth—such a genuine and ironically fitting answer while having a spontaneous conversation with someone who had just stepped out of their comfort zone to talk to him!”',
      takeaway:
        'When you invite people to share what they are quietly proud of, they reveal strengths that standard small talk completely misses.',
      expansionBoost: 9,
      xp: 175
    },
    {
      id: 'vinney',
      name: 'Vinney',
      role: 'Campus Peer / Fellow Student',
      location: 'Grand Foyer & Colonnade Hallway',
      icon: 'smile',
      coords: { x: '82%', y: '18%' },
      image: assetUrl('/topics/strangers/stranger-vinney.jpg'),
      hesitation: {
        thought:
          '“Walking up to someone in the busy foyer felt intimidating. What if he was in a rush between classes or thought the question was random?”',
        fearRating: 60,
        heartRate: 106
      },
      approachPrompt: 'Step forward in the foyer, offer a friendly smile, and break the ice',
      question:
        '“What is your favorite item you have on you right now?”',
      response:
        '“‘My Apple Watch.’ He smiled warmly and tapped his wrist—a relatable, modern answer that immediately opened the door to a relaxed and friendly conversation!”',
      takeaway:
        'Everyday tech is intimately personal; asking people about what they carry or wear creates an effortless, natural bridge between strangers.',
      expansionBoost: 9,
      xp: 150
    },
    {
      id: 'evy',
      name: 'Evy',
      role: 'Campus Peer / Fellow Student',
      location: 'Career Commons Lounge & Foyer',
      icon: 'smile',
      coords: { x: '22%', y: '40%' },
      image: assetUrl('/topics/strangers/stranger-evy.jpg'),
      hesitation: {
        thought:
          '“She was sitting in the Career Commons lounge. Walking up to ask a deep question about life advice felt vulnerable—what if the timing felt awkward?”',
        fearRating: 58,
        heartRate: 104
      },
      approachPrompt: 'Step forward into the lounge, smile warmly, and ask with open curiosity',
      question:
        '“What is a piece of advice you learned that turned out to be very valuable?”',
      response:
        '“‘I learned how to be curious and talk to people!’ Her face beamed with energy—such an incredible, full-circle answer that completely captures the spirit of this entire creative challenge!”',
      takeaway:
        'Learning to be curious and talk to people isn’t just a social skill—it is a superpower that opens every door.',
      expansionBoost: 9,
      xp: 175
    },
    {
      id: 'jackson',
      name: 'Jackson',
      role: 'Campus Peer / Fellow Student',
      location: 'Stairwell Landing & Grand Hall',
      icon: 'smile',
      coords: { x: '50%', y: '38%' },
      image: assetUrl('/topics/strangers/stranger-jackson.jpg'),
      hesitation: {
        thought:
          '“Asking someone to imagine an impromptu TED Talk on the spot is a bold prompt. What if he felt put on the spot or self-conscious?”',
        fearRating: 63,
        heartRate: 109
      },
      approachPrompt: 'Step up near the staircase, smile, and pitch the impromptu challenge',
      question:
        '“If you had to give a 10-minute TED Talk right now with zero preparation, what topic would it be on?”',
      response:
        '“‘Cologne.’ He flashed a peace sign with a huge, radiant grin—such an unexpected, hilarious, and genuinely passionate answer that made the entire interaction pure gold!”',
      takeaway:
        'When you invite people to speak on an unexpected personal niche with zero judgment, you unlock pure spontaneous charisma.',
      expansionBoost: 9,
      xp: 160
    },
    {
      id: 'conner',
      name: 'Conner',
      role: 'Campus Peer / Fellow Student',
      location: 'Student Study Lounge & Hall',
      icon: 'smile',
      coords: { x: '78%', y: '40%' },
      image: assetUrl('/topics/strangers/stranger-conner.jpg'),
      hesitation: {
        thought:
          '“He was focused with his laptop open in the lounge. Approaching someone working on their computer felt risky—what if I broke his deep work flow?”',
        fearRating: 64,
        heartRate: 108
      },
      approachPrompt: 'Step up to the table, smile, and ask with genuine friendliness',
      question:
        '“What is your favorite item you have on you right now?”',
      response:
        '“‘My laptop.’ He smiled brightly, angled the screen up toward me, and laughed—an honest, indispensable student tool that powers everything from classwork to creative exploration!”',
      takeaway:
        'Acknowledging the tools people rely on every single day turns an everyday object into an instant point of connection.',
      expansionBoost: 9,
      xp: 160
    },
    {
      id: 'hugo',
      name: 'Hugo',
      role: 'Campus Peer / Fellow Student',
      location: 'Campus Commons & Tech Lounge',
      icon: 'smile',
      coords: { x: '34%', y: '62%' },
      image: assetUrl('/topics/strangers/stranger-hugo.jpg'),
      hesitation: {
        thought:
          '“He was hanging out in the student lounge by the monitors. Asking someone about their favorite item felt like an unexpected question—what if he thought it was unusual?”',
        fearRating: 59,
        heartRate: 104
      },
      approachPrompt: 'Step over, smile, and ask with lighthearted curiosity',
      question:
        '“What is your favorite item you have on you right now?”',
      response:
        '“‘My book.’ In an era dominated by glowing screens, having a physical book as your go-to item was such a refreshing, thoughtful, and grounded answer!”',
      takeaway:
        'Physical books represent quiet reflection in a noisy digital world; asking about carried items reveals people’s personal sanctuaries.',
      expansionBoost: 9,
      xp: 160
    },
    {
      id: 'josh',
      name: 'Josh',
      role: 'Campus Peer / Fellow Student',
      location: 'Window Lounge · Armstrong Student Center',
      icon: 'smile',
      coords: { x: '66%', y: '62%' },
      image: assetUrl('/topics/strangers/stranger-josh.jpg'),
      hesitation: {
        thought:
          '“Interrupting someone relaxing by the window felt daunting. What if he feels like I’m putting him on the spot with a deep life question?”',
        fearRating: 68,
        heartRate: 112
      },
      approachPrompt: 'Approach the window bay, offer a warm smile, and ask for his perspective',
      question:
        '“What is a piece of advice you learned that turned out to be very valuable?”',
      response:
        '“‘Your habits really make you who you are.’ He shared it with genuine conviction—such a profound and grounding insight that speaks directly to building a daily creative practice.”',
      takeaway:
        'Wisdom isn’t reserved for lectures or distant mentors; your peers are carrying transformative life lessons learned through their own daily habits.',
      expansionBoost: 9,
      xp: 175
    },
    {
      id: 'alex-fitness',
      name: 'Alex',
      role: 'Campus Peer / Fellow Student',
      location: 'Campus Hallway & Gateway Entrance',
      icon: 'smile',
      coords: { x: '18%', y: '84%' },
      image: assetUrl('/topics/strangers/stranger-alex2.jpg'),
      hesitation: {
        thought:
          '“Approaching someone by the doorway to ask for an impromptu talk felt bold. What if he was on his way somewhere or felt put on the spot?”',
        fearRating: 61,
        heartRate: 107
      },
      approachPrompt: 'Step forward near the gateway, offer a warm smile, and ask for his go-to topic',
      question:
        '“If you had to give a 10-minute TED Talk right now with zero preparation, what topic would it be on?”',
      response:
        '“‘Health and fitness.’ He flashed a peace sign with an effortless, confident grin—speaking immediately to a topic he lives, breathes, and practices every single day!”',
      takeaway:
        'When you ask people what they could talk about without prep, you instantly uncover the daily discipline and passions that drive them.',
      expansionBoost: 9,
      xp: 160
    },
    {
      id: 'anna-k',
      name: 'Anna K',
      role: 'Campus Peer / Fellow Student',
      location: 'Atrium Lounge · Farmer School of Business',
      icon: 'smile',
      coords: { x: '50%', y: '84%' },
      image: assetUrl('/topics/strangers/stranger-anna.jpg'),
      hesitation: {
        thought:
          '“She was relaxing in the armchair in the atrium. Approaching someone in a quiet study space felt intrusive—what if she didn’t want to be interrupted?”',
        fearRating: 62,
        heartRate: 105
      },
      approachPrompt: 'Step into the lounge area, smile warmly, and ask with genuine interest',
      question:
        '“What is something you bought that has significantly improved your life?”',
      response:
        '“‘My car.’ She immediately smiled, pulled out her phone, and held up a photo of her car to show me—such an honest, relatable answer about daily freedom that made the conversation feel completely effortless!”',
      takeaway:
        'Asking about practical life upgrades brings out stories of personal independence and pride that people are eager to share.',
      expansionBoost: 9,
      xp: 175
    },
    {
      id: 'anna-s',
      name: 'Anna S',
      role: 'Campus Peer / Fellow Student',
      location: 'Quiet Study Parlor & Library Bay',
      icon: 'smile',
      coords: { x: '82%', y: '84%' },
      image: assetUrl('/topics/strangers/stranger-anna-s.jpg'),
      hesitation: {
        thought:
          '“She was sitting quietly in the study parlor. Asking someone to share a personal achievement they rarely talk about felt vulnerable—what if she felt put on the spot?”',
        fearRating: 64,
        heartRate: 108
      },
      approachPrompt: 'Step into the study parlor, offer a warm smile, and ask with open curiosity',
      question:
        '“What is something you’re proud of you never get to talk about?”',
      response:
        '“‘I graduated with an associates degree.’ Her face lit up with genuine pride and a radiant smile—such an incredible milestone and testament to hard work that deserved every bit of celebration!”',
      takeaway:
        'People carry remarkable personal triumphs they rarely mention in day-to-day conversation; creating a safe space lets their genuine pride shine.',
      expansionBoost: 9,
      xp: 175
    }
  ];

  const strangers = topic.strangerData || defaultStrangers;

  // Selected stranger for interaction
  const [activeStrangerId, setActiveStrangerId] = useState(null);
  // Unlocked strangers array
  const [unlockedIds, setUnlockedIds] = useState([]);
  // Interaction phase: 'map' | 'hesitation' | 'approaching' | 'unlocked'
  const [phase, setPhase] = useState('map');
  const [approachProgress, setApproachProgress] = useState(0);

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

  // Select a stranger from the map
  const handleSelectStranger = (id) => {
    soundManager.playClick();
    setActiveStrangerId(id);

    if (unlockedIds.includes(id)) {
      setPhase('unlocked');
    } else {
      setPhase('hesitation');
      soundManager.playHeartbeat();
    }
  };

  // Trigger the approach action
  const handleStartApproach = () => {
    if (phase !== 'hesitation') return;
    setPhase('approaching');
    soundManager.playApproach();

    let prog = 0;
    const interval = setInterval(() => {
      prog += 15;
      if (prog >= 100) {
        clearInterval(interval);
        setApproachProgress(100);
        setTimeout(() => {
          setUnlockedIds((prev) =>
            prev.includes(activeStrangerId) ? prev : [...prev, activeStrangerId]
          );
          setPhase('unlocked');
          soundManager.playComfortExpansion();
          soundManager.playLevelUp();
          if (onCompleteSection) {
            onCompleteSection(topic.id);
          }
        }, 300);
      } else {
        setApproachProgress(prog);
      }
    }, 60);
  };

  // Keyboard shortcut: Spacebar to approach
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && phase === 'hesitation') {
        e.preventDefault();
        handleStartApproach();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, activeStrangerId]);

  // Reset progress
  const handleReset = () => {
    soundManager.playClick();
    setUnlockedIds([]);
    setPhase('map');
    setActiveStrangerId(null);
    setApproachProgress(0);
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
            <span>Social Curiosity Simulator · Field Experiment</span>
          </div>
          <h2 className="comfort-main-title">The Rejection & Curiosity Gauge</h2>
          <p className="comfort-subtitle">
            Conquering the 5-Second Hesitation Wall by asking deep, genuine questions to random people.
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
              💡 <strong>Action:</strong> Click on any classmate marker across Forsythe Commons to face the 5-Second Hesitation Wall and initiate conversation.
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
              <h3>Choose a Stranger to Approach</h3>
              <p>
                Every stranger is a library of unread stories. Click any marker on the urban grid to confront the fear of rejection and ask an unexpected question.
              </p>
              <div className="idle-quick-stats">
                <div className="stat-pill">
                  <strong>4</strong> Field Encounters
                </div>
                <div className="stat-pill">
                  <strong>{unlockedIds.length} / 4</strong> Completed
                </div>
              </div>
            </div>
          )}

          {/* State 2: Hesitation Phase (The 5-Second Wall) */}
          {phase === 'hesitation' && activeStranger && (
            <div className="panel-hesitation-state">
              <div className="hesitation-alert-banner">
                <AlertTriangle size={18} className="text-rose" />
                <span>The 5-Second Hesitation Wall</span>
              </div>

              <div className="hesitation-stranger-preview">
                <div className="preview-avatar-silhouette">
                  {getIcon(activeStranger.icon)}
                </div>
                <div>
                  <h4 className="preview-name">{activeStranger.name}</h4>
                  <span className="preview-role">{activeStranger.role}</span>
                </div>
              </div>

              {/* Heartbeat & Anxiety Meter */}
              <div className="anxiety-monitor-box">
                <div className="anxiety-header">
                  <span className="heart-bpm">
                    <Heart size={16} className="text-rose heart-throb" />{' '}
                    {activeStranger.hesitation.heartRate} BPM
                  </span>
                  <span className="fear-level-tag">
                    Hesitation Intensity: {activeStranger.hesitation.fearRating}%
                  </span>
                </div>
                <div className="hesitation-thought-bubble">
                  <div className="thought-quote-label">Internal Self-Doubt:</div>
                  <p className="thought-quote-text">
                    {activeStranger.hesitation.thought}
                  </p>
                </div>
              </div>

              {/* Approach Action Call */}
              <div className="approach-action-area">
                <p className="action-hint">
                  The cure for social fear is immediate curiosity. Don’t wait for your brain to invent excuses.
                </p>
                <button
                  className="btn-approach-action"
                  onClick={handleStartApproach}
                >
                  <Zap size={18} />
                  <span>Press [ SPACEBAR ] or Click to Step Forward</span>
                </button>
              </div>
            </div>
          )}

          {/* State 3: Approaching Animation */}
          {phase === 'approaching' && activeStranger && (
            <div className="panel-approaching-state">
              <div className="approaching-spinner">
                <div className="pulse-ripple" />
                <Users size={36} className="text-cyan" />
              </div>
              <h3 className="approaching-title">Stepping Forward...</h3>
              <p className="approaching-subtitle">
                {activeStranger.approachPrompt}
              </p>
              <div className="approach-progress-bar">
                <div
                  className="approach-progress-fill"
                  style={{ width: `${approachProgress}%` }}
                />
              </div>
              <span className="approach-metric">Breaking the Silence...</span>
            </div>
          )}

          {/* State 4: Unlocked Story & Conversation Card */}
          {phase === 'unlocked' && activeStranger && (
            <div className="panel-unlocked-card">
              <div className="unlocked-header">
                <span className="unlocked-tag">
                  <CheckCircle2 size={14} /> Connection Made
                </span>
                <span className="unlocked-reward">
                  +{activeStranger.expansionBoost}% Comfort · +{activeStranger.xp} XP
                </span>
              </div>

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

              {/* Their Unexpected Response */}
              <div className="conversation-section response-bubble">
                <div className="dialogue-speaker-tag response-tag">
                  <Sparkles size={13} /> {activeStranger.name}’s Response:
                </div>
                <p className="dialogue-text-body response-quote">
                  {activeStranger.response}
                </p>
              </div>

              {/* Comfort Zone Epiphany */}
              <div className="creative-takeaway-box">
                <span className="takeaway-badge">
                  <Smile size={14} /> The Creative Takeaway:
                </span>
                <p className="takeaway-text">{activeStranger.takeaway}</p>
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
                  <ArrowRight size={16} /> Return to Map / Next Stranger
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
                Comfort Zone Perimeter: 100% Expanded
              </h4>
              <p className="mastery-desc">
                By asking questions driven by sincere wonder rather than transactional small talk, fear of rejection collapsed. Every human is walking around waiting to be seen.
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
              <RotateCcw size={15} /> Replay Simulator
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
