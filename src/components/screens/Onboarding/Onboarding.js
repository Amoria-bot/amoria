import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import Button from '../../common/Button/Button';

const onboardingData = [
  {
    title: 'Добро пожаловать!',
    description: 'Исследуйте мир увлекательных персонажей.',
    image: '/images/onboarding1.png',
  },
  {
    title: 'Выбирайте персонажей',
    description: 'Общайтесь с интересными героями.',
    image: '/images/onboarding2.png',
  },
  {
    title: 'Получайте награды',
    description: 'Участвуйте в мини-играх и зарабатывайте звёзды.',
    image: '/images/onboarding3.png',
  },
];

function Onboarding({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const completed = localStorage.getItem('onboardingComplete');
    console.log('Onboarding state on load:', completed);
  }, []);

  useEffect(() => {
    const completed = localStorage.getItem('onboardingComplete');
    console.log('Rechecking onboarding state after navigation:', completed);
    if (completed === 'true') navigate('/characters', { replace: true });
  }, [navigate]);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      console.log(`Moved to step ${currentIndex + 1}`);
    } else {
      console.log('Onboarding completed');
      localStorage.setItem('onboardingComplete', 'true');
      onComplete();
      navigate('/characters', { replace: true });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      console.log(`Moved back to step ${currentIndex - 1}`);
    }
  };

  const handleSkip = () => {
    console.log('Skip button pressed. Saving onboardingComplete as true.');
    localStorage.setItem('onboardingComplete', 'true');
    console.log('Navigating to /characters');
    navigate('/characters', { replace: true });
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
    console.log('Touch started at:', touchStartX.current);
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    console.log('Touch ended at:', touchEndX.current);
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    console.log('Swipe distance:', swipeDistance);

    if (swipeDistance > 50) {
      handleNext();
    } else if (swipeDistance < -50) {
      handlePrevious();
    }
  };

  const { title, description, image } = onboardingData[currentIndex];

  return (
    <>
      <div
        className="onboarding"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img src={image} alt={title} className="onboarding-image" />
        <h2>{title}</h2>
        <p>{description}</p>

        <div className="onboarding-indicators">
          {onboardingData.map((_, index) => (
            <img
              key={index}
              src={
                currentIndex === index
                  ? '/images/ellipse1.svg'
                  : '/images/ellipse2.svg'
              }
              alt={`Индикатор ${index + 1}`}
              className="indicator"
            />
          ))}
        </div>

        <img
          src="/images/layer-blur.svg"
          alt="Glow Effect"
          className="glow-effect"
        />
      </div>

      <div className="onboarding-buttons">
        <Button
          text={currentIndex < onboardingData.length - 1 ? 'Далее' : 'Начать'}
          onClick={handleNext}
        />
        {currentIndex < onboardingData.length - 1 && (
          <Button
            text="Пропустить"
            onClick={handleSkip}
            variant="secondary"
            className="skip-button"
          />
        )}
      </div>
    </>
  );
}

export default Onboarding;
