import { useState } from 'react';
import {
  Shield,
  Zap,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle,
  AlertTriangle,
  User,
  Sliders,
  Eye
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { assetUrl } from '../../utils/assetUrl';

export default function Chapter1CharacterCreation({
  topic,
  onUpdateTopicData
}) {
  // Normalized baseline stats for Day 1 on a 1-10 scale
  const rawStats = topic.baselineStats || {};
  const baselineStats = {
    creativeConfidence:
      typeof rawStats.creativeConfidence === 'number' && rawStats.creativeConfidence <= 10
        ? rawStats.creativeConfidence
        : 5,
    fearOfFailure:
      typeof rawStats.fearOfFailure === 'number' && rawStats.fearOfFailure <= 10
        ? rawStats.fearOfFailure
        : 8,
    uncertaintyTolerance:
      typeof rawStats.uncertaintyTolerance === 'number' && rawStats.uncertaintyTolerance <= 10
        ? rawStats.uncertaintyTolerance
        : 6
  };

  const defaultJournal = topic.dayOneJournal || {
    title: 'ESP103 Day 1',
    entry: `In the past, I never considered myself a highly creative person. I identified three important metrics that we have worked on in this class, and rated myself on where I started. My creative confidence was okay, about a 5. Sometimes I was proud of my creative efforts, and other times I was not confident in them. My Fear of Failure was definitely high (and still is). I was afriad of not completing a goal or a task, and how that would hurt me. My Uncertainty Tolerance was acctually fairly high. I worked through many assignments in school where I did not have as much direction as I would have liked, and I learned to adapt and use my creative skills.`
  };

  // Guessing state (1-10 scale, midpoint 5)
  const [guessConfidence, setGuessConfidence] = useState(5);
  const [guessFear, setGuessFear] = useState(5);
  const [guessUncertainty, setGuessUncertainty] = useState(5);
  const [revealed, setRevealed] = useState(false);

  // Baseline stats (fixed to real numbers)
  const actualConfidence = baselineStats.creativeConfidence;
  const actualFear = baselineStats.fearOfFailure;
  const actualUncertainty = baselineStats.uncertaintyTolerance;
  const journalText = defaultJournal.entry;

  const handleSliderChange = (setter) => (e) => {
    setter(Number(e.target.value));
    soundManager.playSliderTick();
  };

  const handleReveal = () => {
    setRevealed(true);
    soundManager.playLevelUp();
  };

  // Convert 1-10 to percentage along the slider track (1 -> 0%, 10 -> 100%)
  const toTrackPct = (val) => `${((val - 1) / 9) * 100}%`;

  // Calculate intuition/accuracy score on 1-10 scale
  const diffConfidence = Math.abs(guessConfidence - actualConfidence);
  const diffFear = Math.abs(guessFear - actualFear);
  const diffUncertainty = Math.abs(guessUncertainty - actualUncertainty);
  const totalDiff = diffConfidence + diffFear + diffUncertainty;
  // Maximum total diff on a 1-10 scale across 3 metrics is at most ~27.
  const empathyScore = Math.max(0, Math.round(100 - (totalDiff * 6.5)));

  return (
    <div className="rpg-character-screen">
      {/* RPG Top Banner */}
      <div className="rpg-screen-header">
        <div className="rpg-header-left">
          <h2 className="rpg-game-title">Select Your Stats</h2>
          <p className="rpg-instruction">
            Can you guess my feelings towards creativity on the 1st day of class?
          </p>
        </div>
      </div>

      {/* Main RPG Interactive Arena */}
      <div className="rpg-arena-grid">
        {/* Left Panel: Sliders & Prediction Controls */}
        <div className="rpg-sliders-panel">
          <div className="panel-badge">
            <Sliders size={14} />
            <span>{revealed ? 'STATS COMPARISON' : 'STEP 1: GUESS MY DAY 1 STATS'}</span>
          </div>

          <p className="panel-helper-text">
            {revealed
              ? 'Here is how your intuition compared against my actual Day 1 reality:'
              : 'Drag the sliders to predict where I started on the first day of class, then hit Reveal Reality.'}
          </p>

          <div className="stat-slider-list">
            {/* Stat 1: Creative Confidence */}
            <div className="stat-group">
              <div className="stat-label-row">
                <div className="stat-title-wrap">
                  <Zap size={16} className="stat-icon confidence-icon" />
                  <span className="stat-name">Creative Confidence</span>
                </div>
                <div className="stat-values-display">
                  {!revealed ? (
                    <span className="guess-val-tag">Guess: {guessConfidence} / 10</span>
                  ) : guessConfidence === actualConfidence ? (
                    <span className="result-chip chip-correct">✓ Correct!</span>
                  ) : guessConfidence > actualConfidence ? (
                    <span className="result-chip chip-over">
                      Overestimated by {guessConfidence - actualConfidence} pt{guessConfidence - actualConfidence === 1 ? '' : 's'}
                    </span>
                  ) : (
                    <span className="result-chip chip-under">
                      Underestimated by {actualConfidence - guessConfidence} pt{actualConfidence - guessConfidence === 1 ? '' : 's'}
                    </span>
                  )}
                </div>
              </div>

              {!revealed ? (
                <div className="slider-wrapper">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={guessConfidence}
                    onChange={handleSliderChange(setGuessConfidence)}
                    className="rpg-slider confidence-slider"
                  />
                </div>
              ) : (
                <div className="revealed-slider-container">
                  <div className="revealed-unified-track">
                    <div
                      className="revealed-fill-bar confidence-bg"
                      style={{ width: toTrackPct(actualConfidence) }}
                    />
                    {guessConfidence === actualConfidence ? (
                      <div
                        className="unified-slider-pin exact-pin"
                        style={{ left: toTrackPct(actualConfidence) }}
                      >
                        <span className="pin-floating-tag tag-above tag-exact">
                          🎯 Match: {actualConfidence}
                        </span>
                        <div className="pin-thumb" />
                      </div>
                    ) : (
                      <>
                        <div
                          className="unified-slider-pin guess-pin"
                          style={{ left: toTrackPct(guessConfidence) }}
                        >
                          <span className="pin-floating-tag tag-above tag-guess">
                            Guess: {guessConfidence}
                          </span>
                          <div className="pin-thumb" />
                        </div>
                        <div
                          className="unified-slider-pin reality-confidence"
                          style={{ left: toTrackPct(actualConfidence) }}
                        >
                          <div className="pin-thumb" />
                          <span className="pin-floating-tag tag-below tag-reality-confidence">
                            Reality: {actualConfidence}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="diff-comment">
                    {guessConfidence > actualConfidence
                      ? '“I felt much more self-conscious than I looked!”'
                      : guessConfidence < actualConfidence
                      ? '“I had a solid starting baseline to build from.”'
                      : '“🎯 Bullseye! Exact match on my Day 1 confidence.”'}
                  </span>
                </div>
              )}
            </div>

            {/* Stat 2: Fear of Failure */}
            <div className="stat-group">
              <div className="stat-label-row">
                <div className="stat-title-wrap">
                  <AlertTriangle size={16} className="stat-icon fear-icon" />
                  <span className="stat-name">Fear of Failure</span>
                </div>
                <div className="stat-values-display">
                  {!revealed ? (
                    <span className="guess-val-tag">Guess: {guessFear} / 10</span>
                  ) : guessFear === actualFear ? (
                    <span className="result-chip chip-correct">✓ Correct!</span>
                  ) : guessFear > actualFear ? (
                    <span className="result-chip chip-over">
                      Overestimated by {guessFear - actualFear} pt{guessFear - actualFear === 1 ? '' : 's'}
                    </span>
                  ) : (
                    <span className="result-chip chip-under">
                      Underestimated by {actualFear - guessFear} pt{actualFear - guessFear === 1 ? '' : 's'}
                    </span>
                  )}
                </div>
              </div>

              {!revealed ? (
                <div className="slider-wrapper">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={guessFear}
                    onChange={handleSliderChange(setGuessFear)}
                    className="rpg-slider fear-slider"
                  />
                </div>
              ) : (
                <div className="revealed-slider-container">
                  <div className="revealed-unified-track">
                    <div
                      className="revealed-fill-bar fear-bg"
                      style={{ width: toTrackPct(actualFear) }}
                    />
                    {guessFear === actualFear ? (
                      <div
                        className="unified-slider-pin exact-pin"
                        style={{ left: toTrackPct(actualFear) }}
                      >
                        <span className="pin-floating-tag tag-above tag-exact">
                          🎯 Match: {actualFear}
                        </span>
                        <div className="pin-thumb" />
                      </div>
                    ) : (
                      <>
                        <div
                          className="unified-slider-pin guess-pin"
                          style={{ left: toTrackPct(guessFear) }}
                        >
                          <span className="pin-floating-tag tag-above tag-guess">
                            Guess: {guessFear}
                          </span>
                          <div className="pin-thumb" />
                        </div>
                        <div
                          className="unified-slider-pin reality-fear"
                          style={{ left: toTrackPct(actualFear) }}
                        >
                          <div className="pin-thumb" />
                          <span className="pin-floating-tag tag-below tag-reality-fear">
                            Reality: {actualFear}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="diff-comment">
                    {guessFear < actualFear
                      ? '“Fear of looking foolish was through the roof on Day 1!”'
                      : guessFear > actualFear
                      ? '“I was nervous, but ready to try.”'
                      : '“🎯 Exact match! Imposter syndrome was real.”'}
                  </span>
                </div>
              )}
            </div>

            {/* Stat 3: Uncertainty Tolerance */}
            <div className="stat-group">
              <div className="stat-label-row">
                <div className="stat-title-wrap">
                  <HelpCircle size={16} className="stat-icon uncertainty-icon" />
                  <span className="stat-name">Uncertainty Tolerance</span>
                </div>
                <div className="stat-values-display">
                  {!revealed ? (
                    <span className="guess-val-tag">Guess: {guessUncertainty} / 10</span>
                  ) : guessUncertainty === actualUncertainty ? (
                    <span className="result-chip chip-correct">✓ Correct!</span>
                  ) : guessUncertainty > actualUncertainty ? (
                    <span className="result-chip chip-over">
                      Overestimated by {guessUncertainty - actualUncertainty} pt{guessUncertainty - actualUncertainty === 1 ? '' : 's'}
                    </span>
                  ) : (
                    <span className="result-chip chip-under">
                      Underestimated by {actualUncertainty - guessUncertainty} pt{actualUncertainty - guessUncertainty === 1 ? '' : 's'}
                    </span>
                  )}
                </div>
              </div>

              {!revealed ? (
                <div className="slider-wrapper">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={guessUncertainty}
                    onChange={handleSliderChange(setGuessUncertainty)}
                    className="rpg-slider uncertainty-slider"
                  />
                </div>
              ) : (
                <div className="revealed-slider-container">
                  <div className="revealed-unified-track">
                    <div
                      className="revealed-fill-bar uncertainty-bg"
                      style={{ width: toTrackPct(actualUncertainty) }}
                    />
                    {guessUncertainty === actualUncertainty ? (
                      <div
                        className="unified-slider-pin exact-pin"
                        style={{ left: toTrackPct(actualUncertainty) }}
                      >
                        <span className="pin-floating-tag tag-above tag-exact">
                          🎯 Match: {actualUncertainty}
                        </span>
                        <div className="pin-thumb" />
                      </div>
                    ) : (
                      <>
                        <div
                          className="unified-slider-pin guess-pin"
                          style={{ left: toTrackPct(guessUncertainty) }}
                        >
                          <span className="pin-floating-tag tag-above tag-guess">
                            Guess: {guessUncertainty}
                          </span>
                          <div className="pin-thumb" />
                        </div>
                        <div
                          className="unified-slider-pin reality-uncertainty"
                          style={{ left: toTrackPct(actualUncertainty) }}
                        >
                          <div className="pin-thumb" />
                          <span className="pin-floating-tag tag-below tag-reality-uncertainty">
                            Reality: {actualUncertainty}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="diff-comment">
                    {guessUncertainty > actualUncertainty
                      ? '“Without a strict rubric, I felt lost at first.”'
                      : guessUncertainty < actualUncertainty
                      ? '“I handled ambiguity better than expected.”'
                      : '“🎯 Nailed it! Ambiguity was uncomfortable on Day 1.”'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button: Reveal Reality or Intuition Score */}
          <div className="rpg-action-footer">
            {!revealed ? (
              <button className="rpg-reveal-btn" onClick={handleReveal}>
                <Eye size={18} />
                <span>REVEAL REALITY</span>
                <Sparkles size={16} className="sparkle-spin" />
              </button>
            ) : (
              <div className="revealed-controls single-score">
                <div className="empathy-score-badge">
                  <Award size={16} className="award-icon" />
                  <span>Professor Intuition: {empathyScore}% Match</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Day 1 Reality & Unlocked Journal Entry */}
        <div className={`rpg-journal-panel ${revealed ? 'unlocked' : 'locked'}`}>
          {!revealed ? (
            <div className="locked-journal-placeholder">
              <div className="lock-icon-wrapper">
                <BookOpen size={36} className="lock-book" />
              </div>
              <h3 className="locked-title">Baseline Journal Entry Locked</h3>
              <p className="locked-desc">
                Adjust your stat guesses on the left and click <strong>“REVEAL REALITY”</strong> to unlock my actual handwritten thoughts from Day 1.
              </p>
              <div className="locked-quest-hint">
                <span>🛡️ Quest: Discover where the creative journey truly began.</span>
              </div>
            </div>
          ) : (
            <div className="unlocked-journal-view">
              <div className="journal-paper-header">
                <div className="paper-stamp">DAY 01 ARCHIVE</div>
                <div className="journal-title-group">
                  <h3 className="journal-headline">{defaultJournal.title}</h3>
                  <span className="journal-timestamp">{defaultJournal.timestamp}</span>
                </div>
              </div>

              {/* Journal Body with Photo Attachment */}
              <div className="journal-content-with-photo">
                <div className="journal-paper-body">
                  <div className="journal-quote-mark">“</div>
                  <p className="journal-entry-text">{journalText}</p>
                </div>

                <div className="day1-polaroid-frame">
                  <div className="polaroid-tape-mark" />
                  <img
                    src={assetUrl('/topics/topic-1-first-day.jpg')}
                    alt="Andrew Garland - Day 1 in Studio"
                    className="day1-polaroid-img"
                  />
                  <div className="polaroid-caption">
                    <span className="caption-name">Andrew Garland</span>
                    <span className="caption-sub">Day 1 • Studio Hall Seat</span>
                  </div>
                </div>
              </div>

              {/* Day 1 Mindset Takeaway */}
              <div className="journal-breakdown-box">
                <h4 className="breakdown-title">Day 1 Mindset Summary:</h4>
                <div className="breakdown-pills">
                  <div className="breakdown-item">
                    <span className="item-label">Confidence</span>
                    <span className="item-val confidence-txt">{actualConfidence} / 10</span>
                    <span className="item-desc">High imposter syndrome</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="item-label">Fear of Failure</span>
                    <span className="item-val fear-txt">{actualFear} / 10</span>
                    <span className="item-desc">Anxiety of being judged</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="item-label">Uncertainty</span>
                    <span className="item-val uncertainty-txt">{actualUncertainty} / 10</span>
                    <span className="item-desc">Craving structure</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
