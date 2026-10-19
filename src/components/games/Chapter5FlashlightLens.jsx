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
  onUpdateTopicData
}) {
  const defaultShots = [
    {
      id: 1,
      title: 'Reflections After the Rain',
      category: 'Specular Neon & Wet Asphalt',
      image: assetUrl('/topics/night-shots/night-puddle.jpg'),
      iso: 'ISO 1600',
      aperture: 'f/1.8',
      shutter: '1/60s',
      lens: '35mm Prime',
      coords: { x: '22%', y: '28%' },
      story:
        'Puddles are nature’s spontaneous mirror. By crouching down inches from the water, the wet cobblestone transformed the rainy alley into a sea of electric cyan and vermilion.',
      lightingInfluence:
        'During daylight, this alley was just dirty pavement and dumpsters. The rain and neon reflections inverted the hierarchy—the ground became more luminous and colorful than the buildings.',
      lesson: 'Look down when everyone else is looking straight ahead. Beauty hides in puddles.'
    },
    {
      id: 2,
      title: 'Tony’s 24/7 Grocery Sanctuary',
      category: 'Warm Tungsten vs. Nocturnal Void',
      image: assetUrl('/topics/night-shots/night-bodega.jpg'),
      iso: 'ISO 800',
      aperture: 'f/2.0',
      shutter: '1/80s',
      lens: '50mm Lens',
      coords: { x: '72%', y: '26%' },
      story:
        'At 2 AM, the city is a cold, sleeping giant. Turning a corner and seeing Tony’s bodega radiating golden tungsten light felt like discovering an oasis in a desert of shadow.',
      lightingInfluence:
        'The extreme contrast between the black street and the warm interior turned the shopkeeper into a character on a lit theater stage. Light became a visual shelter.',
      lesson: 'Contrast creates emotional gravity. Without darkness, warmth has nothing to illuminate.'
    },
    {
      id: 3,
      title: 'The Velocity of City Veins',
      category: 'Long-Exposure Kinetic Painting',
      image: assetUrl('/topics/night-shots/night-trails.jpg'),
      iso: 'ISO 100',
      aperture: 'f/11',
      shutter: '4.0s Bulb',
      lens: '24mm Wide',
      coords: { x: '30%', y: '74%' },
      story:
        'Climbed the pedestrian overpass and clamped the tripod to the railing. Left the shutter open for four seconds as evening traffic accelerated through the highway curves.',
      lightingInfluence:
        'The physical vehicles disappeared from the sensor, leaving behind only the kinetic momentum of their red and white photons. Light painted the passage of time.',
      lesson: 'Patience transforms chaos into harmony. Slowing down your perception changes what you see.'
    },
    {
      id: 4,
      title: 'The Joy of Looking',
      category: 'Nocturnal Urban Explorer',
      image: assetUrl('/topics/topic-5-night-photography.jpg'),
      iso: 'ISO 1250',
      aperture: 'f/1.4',
      shutter: '1/125s',
      lens: '50mm Manual',
      coords: { x: '78%', y: '72%' },
      story:
        'Walking out into the cold night with a camera completely broke my autopilot routine. Instead of staring down at my smartphone, every awning, flickering lamp, and doorway became a stage set.',
      lightingInfluence:
        'Night photography forces you to shoot with intention because photons are scarce. You have to hunt for light rather than passively absorbing it.',
      lesson: 'Creative exploration requires altering your physical constraints—shifting time, temperature, and pace.'
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
