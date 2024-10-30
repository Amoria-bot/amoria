import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Counter from './components/screens/Counter/Counter';
import CharacterProfile from './components/screens/CharacterProfile/CharacterProfile';
import CharacterList from './components/screens/CharacterList/CharacterList';
import Onboarding from './components/screens/Onboarding/Onboarding';
import Chat from './components/screens/Chat/Chat';
import ChatsList from './components/screens/ChatsList/ChatsList';
import Friends from './components/screens/Friends/Friends';
import StarPurchase from './components/screens/StarPurchase/StarPurchase';
import GamesAndTasks from './components/screens/GamesAndTasks/GamesAndTasks';
import WheelOfFortune from './components/screens/WheelOfFortune/WheelOfFortune';
import LoadingScreen from './components/screens/LoadingScreen/LoadingScreen';
import RewardScreen from './components/screens/RewardScreen/RewardScreen';
import BottomNavbar from './components/common/BottomNavbar/BottomNavbar';
import './styles/App.css';

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyStreak, setDailyStreak] = useState(1);
  const [showReward, setShowReward] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Current location:', location.pathname);

  // Проверка на экраны, где не должно быть меню
  const routesWithoutMenu = ['/profile/:slug', '/chat/:slug'];
  const hideMenu = routesWithoutMenu.some((route) => location.pathname.startsWith(route.replace(':slug', '')));

  useEffect(() => {
    console.log('Loading started');
    const timer = setTimeout(() => {
      console.log('Loading finished');
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.classList.add('no-margin');
    } else {
      document.body.classList.remove('no-margin');
    }
    console.log('Loading state changed:', isLoading);
  }, [isLoading]);

  useEffect(() => {
    const completed = localStorage.getItem('onboardingComplete');
    console.log('Onboarding complete state from localStorage:', completed);
    setIsOnboardingComplete(completed === 'true');
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const completed = localStorage.getItem('onboardingComplete');
      console.log('Storage changed, onboardingComplete:', completed);
      setIsOnboardingComplete(completed === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const completed = localStorage.getItem('onboardingComplete');
    console.log('Re-checking onboarding state:', completed);
    setIsOnboardingComplete(completed === 'true');
    if (completed === 'true' && location.pathname === '/') {
      navigate('/characters', { replace: true });
    }
  }, [location, navigate]);

  const isSameDay = useCallback((d1, d2) => (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  ), []);

  const isNextDay = useCallback((d1, d2) => {
    const nextDay = new Date(d1);
    nextDay.setDate(d1.getDate() + 1);
    return isSameDay(nextDay, d2);
  }, [isSameDay]);

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem('dailyStreak'), 10) || 1;
    const savedDate = localStorage.getItem('lastLogin');
    const currentDate = new Date();

    console.log('Last login date:', savedDate ? new Date(savedDate) : 'No previous login');

    if (savedDate) {
      const lastLoginDate = new Date(savedDate);
      if (isNextDay(lastLoginDate, currentDate)) {
        const newStreak = savedStreak + 1;
        setDailyStreak(newStreak);
        localStorage.setItem('dailyStreak', newStreak);
        setShowReward(true);
      } else if (!isSameDay(lastLoginDate, currentDate)) {
        setDailyStreak(1);
        localStorage.setItem('dailyStreak', 1);
      }
      localStorage.setItem('lastLogin', currentDate.toISOString());
    } else {
      setDailyStreak(1);
      localStorage.setItem('dailyStreak', 1);
      localStorage.setItem('lastLogin', currentDate.toISOString());
    }
  }, [isNextDay, isSameDay]);

  const handleOnboardingComplete = () => {
    console.log('Onboarding completed. Saving to localStorage.');
    localStorage.setItem('onboardingComplete', 'true');
    setIsOnboardingComplete(true);
    navigate('/games-and-tasks', { replace: true });
  };

  const resetOnboarding = () => {
    console.log('Onboarding reset');
    localStorage.removeItem('onboardingComplete');
    setIsOnboardingComplete(false);
    navigate('/', { replace: true });
  };

  const handleCloseReward = () => {
    setShowReward(false);
    navigate('/', { replace: true });
  };

  console.log('App render: isLoading=', isLoading, ', isOnboardingComplete=', isOnboardingComplete);

  if (isLoading) return <LoadingScreen />;
  if (showReward) return <RewardScreen streak={dailyStreak} onClose={handleCloseReward} />;
  if (!isOnboardingComplete) return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <div className={`App ${hideMenu ? 'no-padding' : ''}`}>
      <Routes>
        <Route path="/" element={<CharacterList />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/characters" element={<CharacterList />} />
        <Route path="/profile/:slug" element={<CharacterProfile />} />
        <Route path="/chat/:slug" element={<Chat />} />
        <Route path="/chats" element={<ChatsList />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/star-purchase" element={<StarPurchase />} />
        <Route path="/games-and-tasks" element={<GamesAndTasks />} />
        <Route path="/wheel-of-fortune" element={<WheelOfFortune />} />
      </Routes>

      {!hideMenu && <BottomNavbar />}

      <div className="test-controls">
        <button onClick={resetOnboarding} className="reset-button">
          Сбросить онбординг
        </button>
        <button onClick={() => setShowReward(true)} className="test-reward-button">
          Показать награду
        </button>
      </div>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
