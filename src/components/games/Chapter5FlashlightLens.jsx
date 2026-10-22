import { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  Maximize2,
  Compass,
  Eye,
  Sliders,
  CheckCircle2,
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { assetUrl } from '../../utils/assetUrl';

export default function Chapter5FlashlightLens({
  topic,
  onUpdateTopicData,
  onCompleteSection
}) {
  const defaultShots = [
    {
      id: 1,
      title: 'Pearson Hall Entrance',
      category: 'Architectural Warmth & Classical Arches',
      image: assetUrl('/topics/night-shots/pearson-hall-lanterns.jpg'),
      iso: 'ISO 800',
      aperture: 'f/2.8',
      shutter: '1/50s',
      lens: '35mm Prime',
      coords: { x: '22%', y: '26%' },
      story:
        'The grand stone archway of Pearson Hall framed by twin wrought-iron coach lanterns. Walking up to the building at night, the intense golden illumination turns cold masonry into a welcoming, cinematic gateway.',
      lightingInfluence:
        'The high-contrast cast of the lantern globes emphasizes the brick masonry and etched typography above the arch, creating depth and warmth that gets completely lost in flat daytime sunlight.',
      lesson: 'Symmetry and deliberate light fixtures turn institutional architecture into classical poetry.'
    },
    {
      id: 2,
      title: 'King Library: “Welcome Home”',
      category: 'Campus Heart & Nocturnal Sanctuary',
      image: assetUrl('/topics/night-shots/king-library-welcome.jpg'),
      iso: 'ISO 1000',
      aperture: 'f/2.0',
      shutter: '1/60s',
      lens: '50mm Prime',
      coords: { x: '74%', y: '25%' },
      story:
        'The iconic columns of King Library beneath the vibrant red "Welcome Home" banner. For students studying late into the night, this building is a second home and an undeniable beacon of focus.',
      lightingInfluence:
        'The warm uplighting inside the arched portico bounces off the brick interior, while the bold red banner catches just enough illumination to anchor the entire composition in the darkness.',
      lesson: 'Light provides safety and reassurance. At night, a library is more than a building—it is a community refuge.'
    },
    {
      id: 3,
      title: 'The Nocturnal Corridor',
      category: 'Light Falloff & Textured Masonry',
      image: assetUrl('/topics/night-shots/archway-lanterns.jpg'),
      iso: 'ISO 1600',
      aperture: 'f/1.8',
      shutter: '1/80s',
      lens: '50mm Prime',
      coords: { x: '50%', y: '50%' },
      story:
        'A quiet campus entryway bathed in rich amber tungsten from a pair of lanterns mounted on weathered brick. The dark shadows of the long hallway create an intriguing sense of quiet mystery.',
      lightingInfluence:
        'The dramatic inverse-square falloff of light drops off quickly into pitch darkness, highlighting the rough-hewn stone foundation and warm brick patina.',
      lesson: 'What you leave in the shadows is just as important as what you choose to illuminate.'
    },
    {
      id: 4,
      title: 'Windows in the Dark: Dormitory Lives',
      category: 'Windows as Vignettes & Collective Rest',
      image: assetUrl('/topics/night-shots/dorm-windows-night.jpg'),
      iso: 'ISO 1250',
      aperture: 'f/2.8',
      shutter: '1/40s',
      lens: '24mm Wide',
      coords: { x: '18%', y: '72%' },
      story:
        'Looking out across the lawn at the dormitory facade at night. Scattered amber windows punctuate the dark brick exterior—each glowing pane representing a different student studying, laughing, or resting.',
      lightingInfluence:
        'The darkness hides the mundane campus lawn, drawing all focus to the isolated squares of light. The low lamppost across the grass grounds the massive silhouette of the building.',
      lesson: 'Each lit window is an untold story. Night photography turns everyday residential life into contemplative art.'
    },
    {
      id: 5,
      title: 'The Miami “M” Beacon',
      category: 'Campus Identity & Direct Spotlight',
      image: assetUrl('/topics/night-shots/miami-pillar-spotlight.jpg'),
      iso: 'ISO 800',
      aperture: 'f/2.2',
      shutter: '1/60s',
      lens: '50mm Prime',
      coords: { x: '82%', y: '72%' },
      story:
        'A solitary brick column outside the gates with the Miami University bevelled "M" emblem spotlighted from above. The dark iron fence recedes into the night while the emblem shines sharp and proud.',
      lightingInfluence:
        'The tight directional spotlight creates crisp highlights along the bevel of the letterform and raking light across the brick texture.',
      lesson: 'Directional light can elevate a quiet campus symbol into a bold statement of pride and belonging.'
    }
  ];

  const shots = topic.nightShots || defaultShots;

  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 300, y: 200 });
  const [beamRadius, setBeamRadius] = useState(170); // pixels
  const [lampMode, setLampMode] = useState('flashlight'); // 'flashlight' | 'darkroom-red' | 'floodlight'
  const [viewingShot, setViewingShot] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [discoveredIds, setDiscoveredIds] = useState([]);
  const [flashTriggered, setFlashTriggered] = useState(false);

  // Mouse tracking inside darkroom container
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleSelectShot = (shot) => {
    // Shutter sound & camera flash
    soundManager.playCameraShutter();
    setFlashTriggered(true);
    setTimeout(() => setFlashTriggered(false), 220);

    setViewingShot(shot);
    setIsFlipped(false);

    if (!discoveredIds.includes(shot.id)) {
      setDiscoveredIds((prev) => [...prev, shot.id]);
    }

    if (onCompleteSection) {
      onCompleteSection(topic.id);
    }
  };

  const handleFlipCard = (e) => {
    e.stopPropagation();
    soundManager.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleToggleLampMode = (mode) => {
    soundManager.playFlashlightSwitch();
    setLampMode(mode);
    if (mode === 'floodlight') setBeamRadius(320);
    else if (mode === 'darkroom-red') setBeamRadius(200);
    else setBeamRadius(170);
  };

  return (
    <div className="flashlight-darkroom-screen">
      {/* Top Darkroom Header Bar */}
      <div className="darkroom-header-bar">
        <div className="darkroom-title-group">
          <span className="darkroom-badge">INTERACTIVE DARKROOM • CHAPTER 05</span>
          <h2 className="darkroom-heading">The Viewfinder: "Flashlight Lens"</h2>
          <p className="darkroom-subheading">
            The studio canvas is submerged in darkness. Sweep your cursor as a flashlight beam to hunt for hidden nighttime shots, then click to fire the shutter.
          </p>
        </div>

        {/* Darkroom Controls & Counter */}
        <div className="darkroom-actions-group">
          <div className="discovered-counter-pill">
            <Eye size={14} className="eye-icon" />
            <span>Photos Discovered:</span>
            <strong>{discoveredIds.length} / {shots.length}</strong>
          </div>

          <div className="lamp-mode-switcher">
            <button
              className={`lamp-btn ${lampMode === 'flashlight' ? 'active' : ''}`}
              onClick={() => handleToggleLampMode('flashlight')}
              title="Standard Flashlight Beam"
            >
              <Sun size={13} />
              <span>Flashlight</span>
            </button>

            <button
              className={`lamp-btn red-lamp ${lampMode === 'darkroom-red' ? 'active' : ''}`}
              onClick={() => handleToggleLampMode('darkroom-red')}
              title="Darkroom Safe Red Lamp"
            >
              <Moon size={13} />
              <span>Safe Red</span>
            </button>

            <button
              className={`lamp-btn ${lampMode === 'floodlight' ? 'active' : ''}`}
              onClick={() => handleToggleLampMode('floodlight')}
              title="Wide Floodlight Beam"
            >
              <Sparkles size={13} />
              <span>Floodlight</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Pitch-Black Darkroom Arena */}
      <div
        ref={containerRef}
        className={`darkroom-canvas-arena ${lampMode}`}
        onMouseMove={handleMouseMove}
        style={{
          '--spotlight-x': `${mousePos.x}px`,
          '--spotlight-y': `${mousePos.y}px`,
          '--spotlight-radius': `${beamRadius}px`
        }}
      >
        {/* The Blackout Shroud with Cutout Spotlight Mask */}
        <div className="darkroom-shroud" />

        {/* Flashlight Beam Ring & Reticle that follows cursor */}
        <div
          className="flashlight-cursor-reticle"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
          }}
        >
          <div className="lens-crosshair" />
          <span className="lens-iso-tag">35mm f/1.8</span>
        </div>

        {/* Camera Flash Explosion FX */}
        {flashTriggered && <div className="camera-shutter-flash" />}

        {/* Hidden Photo Frames Placed in the Darkness */}
        {shots.map((shot) => {
          const isDiscovered = discoveredIds.includes(shot.id);

          return (
            <div
              key={shot.id}
              className={`hidden-photo-frame ${isDiscovered ? 'found' : ''}`}
              style={{
                left: shot.coords.x,
                top: shot.coords.y
              }}
              onClick={() => handleSelectShot(shot)}
            >
              <div className="frame-border">
                <img src={shot.image} alt={shot.title} className="frame-thumb-img" />
                <div className="frame-overlay-info">
                  <span className="frame-cat">{shot.category}</span>
                  <span className="frame-title">{shot.title}</span>
                  <span className="frame-click-cue">
                    <Camera size={13} />
                    <span>Click to Capture & Flip</span>
                  </span>
                </div>
              </div>
              <div className="frame-hanger-nail" />
            </div>
          );
        })}

        {/* Ambient Darkroom Hint */}
        <div className="darkroom-guidance-hint">
          <span>🔦 Move your mouse to explore the shadows. Click any frame to zoom & inspect.</span>
        </div>
      </div>

      {/* 3D Flip Card Modal Inspection View */}
      {viewingShot && (
        <div className="flip-modal-backdrop" onClick={() => setViewingShot(null)}>
          <div
            className={`flip-card-stage ${isFlipped ? 'flipped' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Front of Card: High-Res Photo & Camera Reticle */}
            <div className="flip-card-face card-front">
              <div className="card-photo-wrapper">
                <img src={viewingShot.image} alt={viewingShot.title} className="zoom-large-img" />
                <div className="viewfinder-grid-overlay">
                  <div className="vf-crosshair center" />
                  <div className="vf-bracket top-left" />
                  <div className="vf-bracket top-right" />
                  <div className="vf-bracket bottom-left" />
                  <div className="vf-bracket bottom-right" />
                </div>
                
                <div className="camera-spec-bar">
                  <span className="spec-item">{viewingShot.lens}</span>
                  <span className="spec-item spec-iso">{viewingShot.iso}</span>
                  <span className="spec-item spec-apt">{viewingShot.aperture}</span>
                  <span className="spec-item spec-sht">{viewingShot.shutter}</span>
                </div>
              </div>

              <div className="card-front-footer">
                <div>
                  <span className="front-cat-tag">{viewingShot.category}</span>
                  <h3 className="front-photo-title">{viewingShot.title}</h3>
                </div>

                <button className="flip-action-btn" onClick={handleFlipCard}>
                  <RotateCcw size={15} />
                  <span>Flip to Story & Lighting</span>
                </button>
              </div>
            </div>

            {/* Back of Card: Story, Lighting Influence, and Creative Lesson */}
            <div className="flip-card-face card-back">
              <div className="card-back-header">
                <div>
                  <span className="back-chapter-tag">PHOTO FIELD NOTES #0{viewingShot.id}</span>
                  <h3 className="back-photo-title">{viewingShot.title}</h3>
                </div>
                <button className="flip-action-btn back-flip" onClick={handleFlipCard}>
                  <Camera size={14} />
                  <span>View Photo</span>
                </button>
              </div>

              <div className="card-back-body">
                {/* The Story Behind The Shot */}
                <div className="field-note-section">
                  <h4 className="note-label">The Story Behind the Shot:</h4>
                  <p className="note-text">{viewingShot.story}</p>
                </div>

                {/* How Lighting Influenced Perspective */}
                <div className="field-note-section highlight-note">
                  <h4 className="note-label">How Lighting Influenced My Perspective:</h4>
                  <p className="note-text">{viewingShot.lightingInfluence}</p>
                </div>

                {/* Creative Lesson */}
                <div className="field-note-section lesson-note">
                  <h4 className="note-label">Creative Lesson Learned:</h4>
                  <p className="note-quote">“{viewingShot.lesson}”</p>
                </div>
              </div>

              <div className="card-back-footer">
                <span className="dismiss-hint">Click outside or press Close to return to Darkroom</span>
                <button
                  className="close-modal-pill"
                  onClick={() => setViewingShot(null)}
                >
                  Close Viewfinder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
