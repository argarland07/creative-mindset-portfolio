import { useState, useEffect, useRef } from 'react';
import StoryChapterView from './components/StoryChapterView';
import CardsOverview from './components/CardsOverview';
import StoryEditModal from './components/StoryEditModal';
import { initialTopics } from './data/topics';
import { soundManager } from './utils/audio';
import './App.css';

function App() {
  const [topics, setTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('creativity_story_topics');
      if (saved) {
        const parsed = JSON.parse(saved);
        return initialTopics.map((init) => {
          const match = parsed.find((p) => p.id === init.id);
          return match
            ? { ...init, ...match, number: init.number, phase: undefined, image: init.image }
            : init;
        });
      }
    } catch {
      // Fallback
    }
    return initialTopics;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Start Screen Homepage) | 'story'
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayProgress, setAutoPlayProgress] = useState(0);
  const [editingTopic, setEditingTopic] = useState(null);
  const [wipeState, setWipeState] = useState('idle'); // 'idle' | 'wiping-in' | 'wiping-out'
  const [chapterTransition, setChapterTransition] = useState({
    status: 'idle', // 'idle' | 'exiting' | 'entering'
    direction: 'forward' // 'forward' | 'backward'
  });

  // Automatic Light / Dark Mode System
  const [themeMode, setThemeMode] = useState(() => {
    try {
      return localStorage.getItem('creativity_theme_mode') || 'auto';
    } catch {
      return 'auto';
    }
  });

  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const effectiveTheme = themeMode === 'auto' ? (systemIsDark ? 'dark' : 'light') : themeMode;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    try {
      localStorage.setItem('creativity_theme_mode', themeMode);
    } catch {
      // Ignore
    }
  }, [effectiveTheme, themeMode]);

  const handleToggleTheme = () => {
    soundManager.playClick();
    setThemeMode((prev) => {
      if (prev === 'auto') return 'light';
      if (prev === 'light') return 'dark';
      return 'auto';
    });
  };

  const autoPlayTimerRef = useRef(null);
  const slideDurationSeconds = 12; // 12 seconds per topic in auto walkthrough

  // Save to local storage on edits
  useEffect(() => {
    try {
      localStorage.setItem('creativity_story_topics', JSON.stringify(topics));
    } catch {
      // Ignore
    }
  }, [topics]);

  const navigateToChapter = (targetIdx, explicitDirection) => {
    if (chapterTransition.status !== 'idle' || targetIdx === currentIndex) return;
    const direction =
      explicitDirection || (targetIdx > currentIndex ? 'forward' : 'backward');
    setAutoPlayProgress(0);
    soundManager.playSlideTransition();
    setChapterTransition({ status: 'exiting', direction });

    setTimeout(() => {
      setCurrentIndex(targetIdx);
      setChapterTransition({ status: 'entering', direction });

      setTimeout(() => {
        setChapterTransition({ status: 'idle', direction });
      }, 400);
    }, 280);
  };

  const handleNext = () => {
    if (chapterTransition.status !== 'idle') return;
    const nextIdx = (currentIndex + 1) % topics.length;
    navigateToChapter(nextIdx, 'forward');
  };

  const handlePrev = () => {
    if (chapterTransition.status !== 'idle') return;
    if (currentIndex > 0) {
      navigateToChapter(currentIndex - 1, 'backward');
    }
  };

  const handleSelectIndex = (idx) => {
    if (wipeState !== 'idle') return;
    soundManager.playSlideTransition();
    setWipeState('wiping-in');
    setTimeout(() => {
      setAutoPlayProgress(0);
      setCurrentIndex(idx);
      setViewMode('story');
      setWipeState('wiping-out');
      setTimeout(() => {
        setWipeState('idle');
      }, 550);
    }, 450);
  };

  const handleBackToStart = () => {
    if (wipeState !== 'idle') return;
    soundManager.playClick();
    setWipeState('wiping-in');
    setTimeout(() => {
      setViewMode('grid');
      setWipeState('wiping-out');
      setTimeout(() => {
        setWipeState('idle');
      }, 550);
    }, 450);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying((prev) => !prev);
      } else if (e.key >= '1' && e.key <= String(topics.length)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < topics.length && idx !== currentIndex) {
          if (viewMode === 'story') {
            navigateToChapter(idx);
          } else {
            handleSelectIndex(idx);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, topics.length, chapterTransition.status, viewMode]);

  // Auto-walkthrough timer
  useEffect(() => {
    if (!isAutoPlaying || viewMode !== 'story') {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    const intervalMs = 100;
    const totalSteps = (slideDurationSeconds * 1000) / intervalMs;

    autoPlayTimerRef.current = setInterval(() => {
      setAutoPlayProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 100 / totalSteps;
      });
    }, intervalMs);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, viewMode, currentIndex, topics.length, chapterTransition.status]);

  const handleSaveTopicNotes = (topicId, updatedFields) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, ...updatedFields } : t))
    );
  };

  const handleResetTopic = (topicId) => {
    const original = initialTopics.find((t) => t.id === topicId);
    if (original) {
      setTopics((prev) =>
        prev.map((t) => (t.id === topicId ? original : t))
      );
    }
  };

  return (
    <div className="story-app">
      {/* Cinematic Screen Wipe Curtain */}
      {wipeState !== 'idle' && (
        <div className={`screen-wipe-curtain ${wipeState}`}>
          <div className="wipe-edge-glow" />
        </div>
      )}

      <main className={`story-main ${viewMode === 'story' ? 'story-immersive' : 'story-homepage'}`}>
        {viewMode === 'story' ? (
          <StoryChapterView
            topics={topics}
            currentIndex={currentIndex}
            chapterTransition={chapterTransition}
            onSelectIndex={handleSelectIndex}
            onNext={handleNext}
            onPrev={handlePrev}
            onOpenEditModal={(topic) => setEditingTopic(topic)}
            onUpdateTopicData={handleSaveTopicNotes}
            isAutoPlaying={isAutoPlaying}
            setIsAutoPlaying={setIsAutoPlaying}
            autoPlayProgress={autoPlayProgress}
            onBackToStart={handleBackToStart}
            themeMode={themeMode}
            onToggleTheme={handleToggleTheme}
          />
        ) : (
          <CardsOverview
            topics={topics}
            onSelectTopic={handleSelectIndex}
          />
        )}
      </main>

      {/* Topic Notes Editor Modal */}
      <StoryEditModal
        topic={editingTopic}
        isOpen={Boolean(editingTopic)}
        onClose={() => setEditingTopic(null)}
        onSave={handleSaveTopicNotes}
        onResetDefault={handleResetTopic}
      />
    </div>
  );
}

export default App;
