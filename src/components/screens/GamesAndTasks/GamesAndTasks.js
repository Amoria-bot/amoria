import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TapGame from '../TapGame/TapGame';
import './GamesAndTasks.css';
import wheelIcon from '../../../assets/images/wheel-of-fortune-icon.png';
import tapIcon from '../../../assets/images/ass.webp';
import xIcon from '../../../assets/icon/x.svg';
import telegramIcon from '../../../assets/icon/tg.svg';
import ConfettiAnimation from '../../animations/ConfettiAnimation';

const GamesAndTasks = () => {
  const [isTapGameActive, setTapGameActive] = useState(false);
  const [xStatus, setXStatus] = useState('Подписаться');
  const [telegramStatus, setTelegramStatus] = useState('Подписаться');
  const confettiActive = useRef(false); // Используем useRef для контроля анимации
  const [showOverlay, setShowOverlay] = useState(false); // Управление видимостью подложки

  const navigate = useNavigate();

  const updateAmoritBalance = useCallback((amount) => {
    const currentBalance = parseInt(localStorage.getItem('amoritBalance'), 10) || 0;
    const newBalance = currentBalance + amount;
    localStorage.setItem('amoritBalance', newBalance);
    console.log(`Баланс обновлён: ${currentBalance} + ${amount} = ${newBalance}`);
  }, []);

  useEffect(() => {
    const savedXStatus = localStorage.getItem('xStatus');
    const savedTelegramStatus = localStorage.getItem('telegramStatus');

    if (savedXStatus) setXStatus(savedXStatus);
    if (savedTelegramStatus) setTelegramStatus(savedTelegramStatus);
  }, []);

  const saveTaskStatus = (platform, status) => {
    console.log(`Сохраняем статус для ${platform}: ${status}`);
    localStorage.setItem(`${platform}Status`, status);
  };

  const triggerConfetti = () => {
    if (!confettiActive.current) {
      console.log('Запуск анимации конфетти');
      confettiActive.current = true; // Устанавливаем флаг активности
      setShowOverlay(true); // Показываем подложку
      setTimeout(() => {
        confettiActive.current = false; // Сбрасываем флаг активности
        setShowOverlay(false); // Убираем подложку
        console.log('Анимация конфетти завершена');
      }, 2000);
    } else {
      console.log('Анимация уже запущена');
    }
  };

  const handleSubscriptionClick = (platform) => {
    console.log(`Нажата кнопка подписки для: ${platform}`);
    if (platform === 'x' && xStatus === 'Подписаться') {
      setXStatus('Проверить');
      saveTaskStatus('x', 'Проверить');
    } else if (platform === 'telegram' && telegramStatus === 'Подписаться') {
      setTelegramStatus('Проверить');
      saveTaskStatus('telegram', 'Проверить');
    }
  };

  const handleVerificationClick = (platform) => {
    console.log(`Проверка подписки для: ${platform}`);
    if (platform === 'x' && xStatus === 'Проверить') {
      setXStatus('Выполнено');
      saveTaskStatus('x', 'Выполнено');
      updateAmoritBalance(100);
      triggerConfetti();
    } else if (platform === 'telegram' && telegramStatus === 'Проверить') {
      setTelegramStatus('Выполнено');
      saveTaskStatus('telegram', 'Выполнено');
      updateAmoritBalance(100);
      triggerConfetti();
    }
  };

  const resetTasks = () => {
    console.log(`Сброс заданий`);
    setXStatus('Подписаться');
    setTelegramStatus('Подписаться');
    localStorage.removeItem('xStatus');
    localStorage.removeItem('telegramStatus');
  };

  if (isTapGameActive) {
    return <TapGame onBack={() => setTapGameActive(false)} />;
  }

  return (
    <div className="games-and-tasks">
      <h2>Играй и зарабатывай амориты!</h2>

      <div className="game-card">
        <img src={tapIcon} alt="Wheel of Fortune" className="tap-icon" />
        <h2>Тапай по попке и&#160;зарабатывай&#160;амориты!</h2>
        <p>+50 аморитов ежедневно</p>
        <button onClick={() => setTapGameActive(true)}>Играть</button>
      </div>

      <div className="game-card">
        <img src={wheelIcon} alt="Tap Game" className="wheel-icon" />
        <h2>Крути колесо фортуны и&#160;выиграй!</h2>
        <p>+50 аморитов ежедневно</p>
        <button onClick={() => navigate('/wheel-of-fortune')}>Играть</button>
      </div>

      <h2>Подпишись на наши соцсети и&#160;получи&#160;+100 аморитов!</h2>

      <div className="social-task">
        <div className="task-content">
          <img src={xIcon} alt="X Icon" className="social-icon" />
          <div className="task-text">
            <span>X</span>
            <span className="reward-text">+100 аморитов</span>
          </div>
        </div>
        <button
          className="subscribe-button"
          onClick={() =>
            xStatus === 'Подписаться'
              ? handleSubscriptionClick('x')
              : handleVerificationClick('x')
          }
          disabled={xStatus === 'Выполнено'}
        >
          {xStatus}
        </button>
      </div>

      <div className="social-task">
        <div className="task-content">
          <img src={telegramIcon} alt="Telegram Icon" className="social-icon" />
          <div className="task-text">
            <span>Telegram</span>
            <span className="reward-text">+100 аморитов</span>
          </div>
        </div>
        <button
          className="subscribe-button"
          onClick={() =>
            telegramStatus === 'Подписаться'
              ? handleSubscriptionClick('telegram')
              : handleVerificationClick('telegram')
          }
          disabled={telegramStatus === 'Выполнено'}
        >
          {telegramStatus}
        </button>
      </div>

      <button className="reset-button" onClick={resetTasks}>
        Сбросить задания
      </button>

      {showOverlay && (
        <div className="confetti-overlay">
          <ConfettiAnimation />
        </div>
      )}
    </div>
  );
};

export default GamesAndTasks;
