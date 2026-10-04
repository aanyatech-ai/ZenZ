import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useZenZStore } from './store/useZenZStore';
import { ZenZLayout } from './components/layout/ZenZLayout';
import { SplashOnboarding } from './pages/SplashOnboarding';
import { Home } from './pages/Home';
import { Syllabus } from './pages/Syllabus';
import { Planner } from './pages/Planner';
import { Calendar } from './pages/Calendar';
import { Notepad } from './pages/Notepad';
import { Profile } from './pages/Profile';

export function App() {
  const { hasCompletedOnboarding, completeOnboarding, user } = useZenZStore();

  // Initialize theme class on mount
  useEffect(() => {
    const root = document.documentElement;
    if (
      user.theme === 'dark' ||
      (user.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [user.theme]);

  // Register service worker if supported
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('ZenZ PWA SW registered:', reg.scope))
        .catch((err) => console.warn('ZenZ SW registration failed:', err));
    }
  }, []);

  if (!hasCompletedOnboarding) {
    return <SplashOnboarding onGetStarted={completeOnboarding} />;
  }

  return (
    <Routes>
      <Route path="/" element={<ZenZLayout />}>
        <Route index element={<Home />} />
        <Route path="syllabus" element={<Syllabus />} />
        <Route path="planner" element={<Planner />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="notes" element={<Notepad />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
