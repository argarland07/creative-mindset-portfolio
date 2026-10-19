import { useState, useEffect, useRef } from 'react';
import StoryNavbar from './components/StoryNavbar';
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
      if (saved) return JSON.parse(saved);
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
      } else if (e.key >= '1' && e.key <= '8') {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < topics.length) {
          soundManager.playSlideTransition();
          setCurrentIndex(idx);
          setViewMode('story');
          setAutoPlayProgress(0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, topics.length]);

  // Auto-walkthrough timer
  useEffect(() => {
    if (!isAutoPlaying || viewMode !== 'story') {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      setAutoPlayProgress(0);
      return;
    }

    const intervalMs = 100;
    const totalSteps = (slideDurationSeconds * 1000) / intervalMs;

    autoPlayTimerRef.current = setInterval(() => {
      setAutoPlayProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((curr) => {
            const nextIdx = (curr + 1) % topics.length;
            soundManager.playSlideTransition();
            return nextIdx;
          });
          return 0;
        }
        return prev + 100 / totalSteps;
      });
    }, intervalMs);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, viewMode, currentIndex, topics.length]);

  const handleNext = () => {
    setAutoPlayProgress(0);
    setCurrentIndex((prev) => (prev + 1) % topics.length);
    soundManager.playSlideTransition();
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setAutoPlayProgress(0);
      setCurrentIndex((prev) => prev - 1);
      soundManager.playSlideTransition();
    }
  };

  const handleSelectIndex = (idx) => {
    setAutoPlayProgress(0);
    setCurrentIndex(idx);
    setViewMode('story');
  };

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
      {/* Windows 10 Metro Navigation Bar - shown on Start Screen */}
      {viewMode === 'grid' && (
        <StoryNavbar
          viewMode={viewMode}
          setViewMode={setViewMode}
          isAutoPlaying={isAutoPlaying}
          setIsAutoPlaying={setIsAutoPlaying}
          currentChapter={currentIndex + 1}
          totalChapters={topics.length}
          themeMode={themeMode}
          effectiveTheme={effectiveTheme}
          onToggleTheme={handleToggleTheme}
        />
      )}

      <main className="story-main">
        {viewMode === 'story' ? (
          <StoryChapterView
            topics={topics}
            currentIndex={currentIndex}
            onSelectIndex={handleSelectIndex}
            onNext={handleNext}
            onPrev={handlePrev}
            onOpenEditModal={(topic) => setEditingTopic(topic)}
            onUpdateTopicData={handleSaveTopicNotes}
            isAutoPlaying={isAutoPlaying}
            setIsAutoPlaying={setIsAutoPlaying}
            autoPlayProgress={autoPlayProgress}
            onBackToStart={() => setViewMode('grid')}
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
