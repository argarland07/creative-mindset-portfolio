import { useState, useEffect } from 'react';
import {
  Zap,
  AlertTriangle,
  HelpCircle,
  Sliders,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  ChevronRight,
  ArrowRight,
  Quote
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { assetUrl } from '../../utils/assetUrl';

export default function Chapter1CharacterCreation({
  topic,
  onUpdateTopicData,
  onCompleteSection,
  phase = 'attributes', // 'attributes' | 'reflection'
  isTransitioning = false,
  onGoToReflection,
  onGoToAttributes,
  onProceedToNextChapter
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
    <div className={`character-creator-screen ${isTransitioning ? 'is-transitioning' : ''}`}>
      {/* Holographic Transition Flash Ring */}
      {isTransitioning && <div className="transition-energy-ring" />}

      <div className="character-creator-container">
        {/* Left Column: The Character Model */}
        <div className="character-stage-column">
          <div className="character-model-wrapper">
            {/* Background Aura Glow based on confidence */}
            <div
              className={`character-aura-glow ${phase === 'reflection' ? 'reflection-aura' : ''}`}
              style={{
                opacity: phase === 'reflection' ? 0.75 : 0.35 + (confidence / 20)
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
            <div className={`nametag-status-dot ${phase === 'reflection' ? 'reflection-dot' : ''}`} />
            <div className="nametag-text-group">
              <span className="nametag-player-name">Andrew Garland</span>
              <span className="nametag-class-title">
                {phase === 'reflection'
                  ? 'ESP103 • Day 1 Personal Reflection'
                  : 'ESP103 • Day 1 Creative Protagonist'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic View (Attributes OR Reflection) */}
        {phase === 'attributes' ? (
          <div className={`character-attributes-column ${isTransitioning ? 'anim-attributes-exit' : 'anim-attributes-enter'}`}>
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

            {/* Reveal Reality Button & Optional Next Trigger */}
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

              {onGoToReflection && (
                <button
                  type="button"
                  className="btn-step-next-reflection"
                  onClick={onGoToReflection}
                  title="Proceed to Day 1 Reflection"
                >
                  <span>Reflection</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Reflection Dialogue View */
          <div className={`character-reflection-column ${isTransitioning ? 'anim-reflection-exit' : 'anim-reflection-enter'}`}>
            <div className="reflection-header">
              <div className="reflection-badge">
                <Sparkles size={16} />
                <span>DAY 1 REFLECTION</span>
              </div>
              <h3 className="reflection-title">Where My Creative Journey Began</h3>
            </div>

            <div className="reflection-narrative-card">
              <div className="reflection-quote-icon-wrap">
                <Quote size={22} className="reflection-quote-svg" />
              </div>
              <div className="reflection-text-paragraphs">
                <p>
                  In the past, I never considered myself a highly creative person. I identified three important metrics that we have worked on in this class, and rated myself on where I started.
                </p>
                <p>
                  My creative confidence was okay, about a 5. Sometimes I was proud of my creative efforts, and other times I was not confident in them. My Fear of Failure was definitely high (and still is). I was afraid of not completing a goal or a task, and how that would hurt me. My Uncertainty Tolerance was actually fairly high. I worked through many assignments in school where I did not have as much direction as I would have liked, and I learned to adapt and use my creative skills.
                </p>
              </div>
            </div>

            {/* Metric Baseline Takeaway Pills */}
            <div className="reflection-stats-summary-row">
              <div className="reflection-stat-chip chip-confidence">
                <Zap size={14} />
                <span className="stat-name">Creative Confidence:</span>
                <span className="stat-val">5 / 10 (Okay)</span>
              </div>
              <div className="reflection-stat-chip chip-fear">
                <AlertTriangle size={14} />
                <span className="stat-name">Fear of Failure:</span>
                <span className="stat-val">8 / 10 (High)</span>
              </div>
              <div className="reflection-stat-chip chip-uncertainty">
                <HelpCircle size={14} />
                <span className="stat-name">Uncertainty Tolerance:</span>
                <span className="stat-val">6 / 10 (Fairly High)</span>
              </div>
            </div>

            {/* In-Card Navigation Controls */}
            <div className="reflection-actions-footer">
              <button
                type="button"
                className="btn-back-to-attributes"
                onClick={onGoToAttributes}
                title="Return to the movable stats sliders"
              >
                <RotateCcw size={15} />
                <span>Review Character Stats</span>
              </button>
              {onProceedToNextChapter && (
                <button
                  type="button"
                  className="btn-proceed-next-chapter"
                  onClick={onProceedToNextChapter}
                  title="Advance to Chapter 2: Exploring Creativity, Business, and AI"
                >
                  <span>Next Chapter: Business & AI</span>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
