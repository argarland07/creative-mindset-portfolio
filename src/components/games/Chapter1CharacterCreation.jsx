import { useState, useEffect } from 'react';
import {
  Zap,
  AlertTriangle,
  HelpCircle,
  Sliders,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { assetUrl } from '../../utils/assetUrl';

export default function Chapter1CharacterCreation({
  topic,
  onUpdateTopicData,
  onCompleteSection
}) {
  // Andrew's real Day 1 baseline values
  const realConfidence = 6;
  const realFear = 8;
  const realUncertainty = 6;

  const [confidence, setConfidence] = useState(() => {
    const saved = topic.baselineStats?.creativeConfidence;
    return typeof saved === 'number' && saved >= 1 && saved <= 10 ? saved : 5;
  });

  const [fear, setFear] = useState(() => {
    const saved = topic.baselineStats?.fearOfFailure;
    return typeof saved === 'number' && saved >= 1 && saved <= 10 ? saved : 5;
  });

  const [uncertainty, setUncertainty] = useState(() => {
    const saved = topic.baselineStats?.uncertaintyTolerance;
    return typeof saved === 'number' && saved >= 1 && saved <= 10 ? saved : 5;
  });

  const [revealed, setRevealed] = useState(false);

  // Mark section complete immediately so next button is available
  useEffect(() => {
    if (onCompleteSection) {
      onCompleteSection(topic.id);
    }
  }, [topic.id, onCompleteSection]);

  const handleSliderChange = (statName, setter) => (e) => {
    const val = Number(e.target.value);
    setter(val);
    soundManager.playSliderTick();

    if (onUpdateTopicData) {
      onUpdateTopicData(topic.id, {
        baselineStats: {
          creativeConfidence: statName === 'confidence' ? val : confidence,
          fearOfFailure: statName === 'fear' ? val : fear,
          uncertaintyTolerance: statName === 'uncertainty' ? val : uncertainty
        }
      });
    }

    if (onCompleteSection) {
      onCompleteSection(topic.id);
    }
  };

  const handleToggleReveal = () => {
    if (!revealed) {
      soundManager.playLevelUp();
    } else {
      soundManager.playClick();
    }
    setRevealed((prev) => !prev);
  };

  // Convert 1-10 to percentage along the slider track (1 -> 0%, 10 -> 100%)
  const toTrackPct = (val) => `${((val - 1) / 9) * 100}%`;

  const renderComparisonChip = (guess, actual, pillClass) => {
    if (!revealed) {
      return (
        <div className={`attribute-value-pill ${pillClass}`}>
          <span>{guess}</span>
          <span className="val-max">/ 10</span>
        </div>
      );
    }

    if (guess === actual) {
      return (
        <div className="attribute-result-chip chip-correct">
          <CheckCircle2 size={13} />
          <span>Correct! ({actual})</span>
        </div>
      );
    }

    if (guess > actual) {
      return (
        <div className="attribute-result-chip chip-over">
          <span>Over by +{guess - actual} (Real: {actual})</span>
        </div>
      );
    }

    return (
      <div className="attribute-result-chip chip-under">
        <span>Under by -{actual - guess} (Real: {actual})</span>
      </div>
    );
  };

  return (
    <div className="character-creator-screen">
      <div className="character-creator-container">
        {/* Left Column: The Character Model */}
        <div className="character-stage-column">
          <div className="character-model-wrapper">
            {/* Background Aura Glow based on confidence */}
            <div
              className="character-aura-glow"
              style={{
                opacity: 0.35 + (confidence / 20)
              }}
            />

            {/* Cutout Image of Andrew */}
            <img
              src={assetUrl('/andrew-character.png')}
              alt="Andrew Garland - Character Creator Model"
              className="character-cutout-img"
              loading="eager"
            />

            {/* Grounding Shadow / Pedestal */}
            <div className="character-pedestal-shadow" />
          </div>

          {/* Character Identity Tag */}
          <div className="character-nametag-card">
            <div className="nametag-status-dot" />
            <div className="nametag-text-group">
              <span className="nametag-player-name">Andrew Garland</span>
              <span className="nametag-class-title">ESP103 • Day 1 Creative Protagonist</span>
            </div>
          </div>
        </div>

        {/* Right Column: The Movable Bars */}
        <div className="character-attributes-column">
          <div className="attributes-header">
            <div className="attributes-badge">
              <Sliders size={16} />
              <span>CHARACTER ATTRIBUTES</span>
            </div>
            <p className="attributes-subtitle">
              Drag the movable bars to configure my Day 1 stats, then hit <strong>Reveal Real Answers</strong>!
            </p>
          </div>

          <div className="attributes-slider-list">
            {/* Stat 1: Creative Confidence */}
            <div className={`attribute-card confidence-card ${revealed && confidence === realConfidence ? 'card-matched' : ''}`}>
              <div className="attribute-header-row">
                <div className="attribute-title-wrap">
                  <div className="attribute-icon-bubble confidence-bubble">
                    <Zap size={16} />
                  </div>
                  <div className="attribute-name-wrap">
                    <span className="attribute-label">Creative Confidence</span>
                    <span className="attribute-sublabel">Self-belief in original ideas</span>
                  </div>
                </div>
                {renderComparisonChip(confidence, realConfidence, 'confidence-pill')}
              </div>

              <div className="attribute-slider-track-wrap">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={confidence}
                  onChange={handleSliderChange('confidence', setConfidence)}
                  className="attribute-slider-input confidence-input"
                  aria-label="Creative Confidence Slider"
                />

                {/* Target Reality Marker Pin when Revealed */}
                {revealed && (
                  <div
                    className="real-target-pin reality-pin-confidence"
                    style={{ left: toTrackPct(realConfidence) }}
                    title={`Real Answer: ${realConfidence}`}
                  >
                    <span className="pin-flag">Real: {realConfidence}</span>
                    <div className="pin-needle" />
                  </div>
                )}
              </div>

              <div className="attribute-scale-labels">
                <span>1 (Self-Conscious)</span>
                <span>5</span>
                <span>10 (Unstoppable)</span>
              </div>
            </div>

            {/* Stat 2: Fear of Failure */}
            <div className={`attribute-card fear-card ${revealed && fear === realFear ? 'card-matched' : ''}`}>
              <div className="attribute-header-row">
                <div className="attribute-title-wrap">
                  <div className="attribute-icon-bubble fear-bubble">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="attribute-name-wrap">
                    <span className="attribute-label">Fear of Failure</span>
                    <span className="attribute-sublabel">Anxiety of being wrong or judged</span>
                  </div>
                </div>
                {renderComparisonChip(fear, realFear, 'fear-pill')}
              </div>

              <div className="attribute-slider-track-wrap">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={fear}
                  onChange={handleSliderChange('fear', setFear)}
                  className="attribute-slider-input fear-input"
                  aria-label="Fear of Failure Slider"
                />

                {/* Target Reality Marker Pin when Revealed */}
                {revealed && (
                  <div
                    className="real-target-pin reality-pin-fear"
                    style={{ left: toTrackPct(realFear) }}
                    title={`Real Answer: ${realFear}`}
                  >
                    <span className="pin-flag">Real: {realFear}</span>
                    <div className="pin-needle" />
                  </div>
                )}
              </div>

              <div className="attribute-scale-labels">
                <span>1 (Fearless)</span>
                <span>5</span>
                <span>10 (Paralyzed)</span>
              </div>
            </div>

            {/* Stat 3: Uncertainty Tolerance */}
            <div className={`attribute-card uncertainty-card ${revealed && uncertainty === realUncertainty ? 'card-matched' : ''}`}>
              <div className="attribute-header-row">
                <div className="attribute-title-wrap">
                  <div className="attribute-icon-bubble uncertainty-bubble">
                    <HelpCircle size={16} />
                  </div>
                  <div className="attribute-name-wrap">
                    <span className="attribute-label">Uncertainty Tolerance</span>
                    <span className="attribute-sublabel">Comfort with ambiguity & no rubric</span>
                  </div>
                </div>
                {renderComparisonChip(uncertainty, realUncertainty, 'uncertainty-pill')}
              </div>

              <div className="attribute-slider-track-wrap">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={uncertainty}
                  onChange={handleSliderChange('uncertainty', setUncertainty)}
                  className="attribute-slider-input uncertainty-input"
                  aria-label="Uncertainty Tolerance Slider"
                />

                {/* Target Reality Marker Pin when Revealed */}
                {revealed && (
                  <div
                    className="real-target-pin reality-pin-uncertainty"
                    style={{ left: toTrackPct(realUncertainty) }}
                    title={`Real Answer: ${realUncertainty}`}
                  >
                    <span className="pin-flag">Real: {realUncertainty}</span>
                    <div className="pin-needle" />
                  </div>
                )}
              </div>

              <div className="attribute-scale-labels">
                <span>1 (Craves Formula)</span>
                <span>5</span>
                <span>10 (Thrives in Ambiguity)</span>
              </div>
            </div>
          </div>

          {/* Reveal Reality Button */}
          <div className="attributes-footer">
            <button
              type="button"
              className={`btn-reveal-reality ${revealed ? 'active-revealed' : ''}`}
              onClick={handleToggleReveal}
              title={revealed ? 'Click to hide answers' : 'Reveal Andrew’s real Day 1 stats'}
            >
              {revealed ? (
                <>
                  <EyeOff size={16} />
                  <span>HIDE REAL ANSWERS</span>
                </>
              ) : (
                <>
                  <Eye size={16} />
                  <span>REVEAL REAL ANSWERS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
