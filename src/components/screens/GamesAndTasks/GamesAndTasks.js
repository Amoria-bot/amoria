import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TapGame from '../TapGame/TapGame';
import './GamesAndTasks.css';
import wheelIcon from '../../../assets/images/wheel-of-fortune-icon.png';
import taplIcon from '../../../assets/images/tap-icon.png';
import xIcon from '../../../assets/icon/x.svg';
import telegramIcon from '../../../assets/icon/tg.svg';

const GamesAndTasks = () => {
  const [isTapGameActive, setTapGameActive] = useState(false);
  const [xStatus, setXStatus] = useState('Подписаться');
  const [telegramStatus, setTelegramStatus] = useState('Подписаться');

  const navigate = useNavigate();

  // Обновление баланса аморитов при выполнении задач
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
    localStorage.setItem(`${platform}Status`, status);
  };

  const handleSubscriptionClick = (platform) => {
    if (platform === 'x' && xStatus === 'Подписаться') {
      setXStatus('Проверить');
      saveTaskStatus('x', 'Проверить');
    } else if (platform === 'telegram' && telegramStatus === 'Подписаться') {
      setTelegramStatus('Проверить');
      saveTaskStatus('telegram', 'Проверить');
    }
  };

  const handleVerificationClick = (platform) => {
    if (platform === 'x' && xStatus === 'Проверить') {
      setXStatus('Выполнено');
      saveTaskStatus('x', 'Выполнено');
      updateAmoritBalance(100); // Добавляем 100 аморитов за подписку
    } else if (platform === 'telegram' && telegramStatus === 'Проверить') {
      setTelegramStatus('Выполнено');
      saveTaskStatus('telegram', 'Выполнено');
      updateAmoritBalance(100); // Добавляем 100 аморитов за подписку
    }
  };

  const resetTasks = () => {
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
        <img src={wheelIcon} alt="Wheel of Fortune" className="wheel-icon" />
        <h2>Тапай по попке и&#160;зарабатывай&#160;амориты!</h2>
        <p>+50 аморитов ежедневно</p>
        <button onClick={() => setTapGameActive(true)}>Играть</button>
      </div>

      <div className="game-card">
        <img src={taplIcon} alt="Tap Game" className="tap-icon" />
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
    </div>
  );
};

export default GamesAndTasks;
