import { useState, useRef } from 'react';
import {
  Camera,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  Maximize2,
  Eye,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  X,
  CheckCircle2
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { assetUrl } from '../../utils/assetUrl';

const DEFAULT_SHOTS = [
  {
    id: 1,
    title: 'Pearson Hall Entrance',
    image: assetUrl('/topics/night-shots/pearson-hall-lanterns.jpg'),
    coords: { x: '22%', y: '26%' }
  },
  {
    id: 2,
    title: 'King Library: "Welcome Home"',
    image: assetUrl('/topics/night-shots/king-library-welcome.jpg'),
    coords: { x: '74%', y: '25%' }
  },
  {
    id: 3,
    title: 'The Nocturnal Corridor',
    image: assetUrl('/topics/night-shots/archway-lanterns.jpg'),
    coords: { x: '50%', y: '50%' }
  },
  {
    id: 4,
    title: 'Windows in the Dark: Dormitory Lives',
    image: assetUrl('/topics/night-shots/dorm-windows-night.jpg'),
    coords: { x: '18%', y: '72%' }
  },
  {
    id: 5,
    title: 'The Miami "M" Beacon',
    image: assetUrl('/topics/night-shots/miami-pillar-spotlight.jpg'),
    coords: { x: '82%', y: '72%' }
  }
];

export default function Chapter4FlashlightLens({
  topic,
  onCompleteSection
}) {
  const shots = topic.nightShots || DEFAULT_SHOTS;

  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 300, y: 200 });
  const [beamRadius, setBeamRadius] = useState(280);
  const [lampMode, setLampMode] = useState('flashlight'); // 'flashlight' | 'darkroom-red' | 'floodlight'
  const [viewingShot, setViewingShot] = useState(null);
  const [capturedIds, setCapturedIds] = useState([]);
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
    // Camera shutter sound & white flash explosion
    soundManager.playCameraShutter();
    setFlashTriggered(true);
    setTimeout(() => setFlashTriggered(false), 240);

    // Open clean close-up
    setViewingShot(shot);
  };

  const handleCloseViewingShot = () => {
    if (viewingShot) {
      if (!capturedIds.includes(viewingShot.id)) {
        const next = [...capturedIds, viewingShot.id];
        setCapturedIds(next);

        if (next.length >= shots.length) {
          soundManager.playLevelUp();
          if (onCompleteSection) {
            onCompleteSection(topic.id);
          }
        }
      }
    }
    setViewingShot(null);
  };

  const handleResetGallery = () => {
    soundManager.playClick();
    setCapturedIds([]);
  };

  const handleToggleLampMode = (mode) => {
    soundManager.playFlashlightSwitch();
    setLampMode(mode);
    if (mode === 'floodlight') setBeamRadius(480);
    else if (mode === 'darkroom-red') setBeamRadius(360);
    else setBeamRadius(280);
  };

  const uncapturedShots = shots.filter((s) => !capturedIds.includes(s.id));
  const capturedShots = shots.filter((s) => capturedIds.includes(s.id));

  return (
    <div className="flashlight-darkroom-screen">
      {/* Top Darkroom Header Bar */}
      <div className="darkroom-header-bar">
        <div className="darkroom-title-group">
          <span className="darkroom-badge">INTERACTIVE DARKROOM • CHAPTER 04</span>
          <h2 className="darkroom-heading">The Viewfinder: &ldquo;Flashlight Lens&rdquo;</h2>
          <p className="darkroom-subheading">
            The studio canvas is submerged in darkness. Sweep your cursor as a flashlight beam to hunt for hidden nighttime shots, then click to capture them into your gallery!
          </p>
        </div>

        {/* Darkroom Controls & Counter */}
        <div className="darkroom-actions-group">
          <div className="discovered-counter-pill">
            <Eye size={14} className="eye-icon" />
            <span>Captured:</span>
            <strong>{capturedIds.length} / {shots.length}</strong>
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

          {/* Direct Beam Size Adjuster */}
          <div className="beam-size-control">
            <button
              type="button"
              className="beam-adj-btn"
              onClick={() => {
                soundManager.playSliderTick();
                setBeamRadius((prev) => Math.max(180, prev - 40));
              }}
              title="Narrow Flashlight Beam"
            >
              <ZoomOut size={13} />
            </button>
            <span className="beam-size-label">Beam: {beamRadius}px</span>
            <button
              type="button"
              className="beam-adj-btn"
              onClick={() => {
                soundManager.playSliderTick();
                setBeamRadius((prev) => Math.min(600, prev + 40));
              }}
              title="Widen Flashlight Beam"
            >
              <ZoomIn size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Flashlight Arena with Very Dim Background Image */}
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
        {/* Very Dim Background Image Uploaded by User */}
        <div
          className="darkroom-dim-background"
          style={{
            backgroundImage: `url(${assetUrl('/topics/night-shots/flashlight-bg.jpg')})`
          }}
        />

        {/* The Blackout Shroud with Radial Cutout */}
        <div className="darkroom-shroud" />

        {/* Flashlight Beam Reticle that follows cursor */}
        <div
          className="flashlight-cursor-reticle"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
          }}
        >
          <div className="lens-crosshair" />
          <span className="lens-iso-tag">35mm f/1.8</span>
        </div>

        {/* White Camera Flash Explosion */}
        {flashTriggered && <div className="camera-shutter-flash" />}

        {/* Hidden Photo Frames Remaining in the Darkroom */}
        {uncapturedShots.map((shot) => (
          <div
            key={shot.id}
            className="hidden-photo-frame"
            style={{
              left: shot.coords.x,
              top: shot.coords.y
            }}
            onClick={() => handleSelectShot(shot)}
            title="Click to capture"
          >
            <div className="frame-border">
              <img src={shot.image} alt={shot.title} className="frame-thumb-img" />
            </div>
            <div className="frame-hanger-nail" />
          </div>
        ))}

        {uncapturedShots.length === 0 && (
          <div className="darkroom-all-captured-banner">
            <CheckCircle2 size={24} className="banner-check-icon" />
            <div>
              <h4>All Night Photographs Captured!</h4>
              <p>Every photo has been moved to your gallery below.</p>
            </div>
          </div>
        )}

        {/* Ambient Darkroom Hint */}
        <div className="darkroom-guidance-hint">
          <span>🔦 Move your mouse to explore the shadows. Click any photo to capture it!</span>
        </div>
      </div>

      {/* User's Captured Gallery Below Flashlight Scene */}
      <div className="night-gallery-strip-container">
        <div className="gallery-header-row">
          <div className="gallery-title-group">
            <div className="gallery-icon-bubble">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="gallery-strip-title">Captured Night Gallery</h3>
              <p className="gallery-strip-subtitle">
                {capturedShots.length === 0
                  ? 'Photos you discover and capture above will appear here in your collection.'
                  : `${capturedShots.length} of ${shots.length} photographs captured to your gallery.`}
              </p>
            </div>
          </div>

          {capturedShots.length > 0 && (
            <button
              type="button"
              className="btn-reset-darkroom"
              onClick={handleResetGallery}
              title="Reset the darkroom to hunt for photos again"
            >
              <RotateCcw size={13} />
              <span>Reset Search</span>
            </button>
          )}
        </div>

        {capturedShots.length > 0 ? (
          <div className="gallery-grid-row">
            {capturedShots.map((shot) => (
              <div
                key={shot.id}
                className="gallery-photo-card"
                onClick={() => setViewingShot(shot)}
                title="Click to view close-up"
              >
                <div className="gallery-photo-thumb-wrap">
                  <img src={shot.image} alt={shot.title} className="gallery-thumb-img" />
                  <div className="gallery-zoom-overlay">
                    <Maximize2 size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="gallery-empty-state">
            <span className="empty-hint-text">
              No photos captured yet. Sweep your flashlight over the scene above and click to capture them!
            </span>
          </div>
        )}
      </div>

      {/* Clean Close-up Modal (No text details) */}
      {viewingShot && (
        <div className="photo-closeup-backdrop" onClick={handleCloseViewingShot}>
          <div
            className="photo-closeup-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="closeup-close-btn"
              onClick={handleCloseViewingShot}
              title="Close & continue"
            >
              <X size={20} />
            </button>

            <div className="closeup-image-frame">
              <img
                src={viewingShot.image}
                alt={viewingShot.title}
                className="closeup-full-img"
              />
              <div className="viewfinder-grid-overlay">
                <div className="vf-crosshair center" />
                <div className="vf-bracket top-left" />
                <div className="vf-bracket top-right" />
                <div className="vf-bracket bottom-left" />
                <div className="vf-bracket bottom-right" />
              </div>
            </div>

            <div className="closeup-action-bar">
              <button
                type="button"
                className="btn-continue-gallery"
                onClick={handleCloseViewingShot}
              >
                <span>Save to Gallery & Continue</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
