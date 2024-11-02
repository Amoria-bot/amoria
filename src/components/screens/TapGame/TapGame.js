import React, { useState, useEffect, useRef, useCallback } from 'react';
import './TapGame.css';
import characterImage from '../../../assets/images/ass.webp';
import arrowLeft from '../../../assets/icon/arrow-left.svg';
import ConfettiAnimation from '../../animations/ConfettiAnimation'; // Импорт анимации

const TapGame = ({ onBack }) => {
  const canvasRef = useRef(null);
  const confettiActive = useRef(false); // Контроль анимации конфетти
  const [showConfetti, setShowConfetti] = useState(false); // Видимость конфетти

  const [amoritBalance, setAmoritBalance] = useState(
    parseInt(localStorage.getItem('amoritBalance'), 10) || 0
  );
  const [tapsRemaining, setTapsRemaining] = useState(() => {
    const savedTaps = localStorage.getItem('tapsRemaining');
    return savedTaps !== null ? parseInt(savedTaps, 10) : 100;
  });

  const [isSessionActive, setIsSessionActive] = useState(true);
  const [isCooldownActive, setIsCooldownActive] = useState(
    () => JSON.parse(localStorage.getItem('isCooldownActive')) || false
  );

  const [cooldownTime, setCooldownTime] = useState(() => {
    const savedCooldownEnd = localStorage.getItem('cooldownEnd');
    if (savedCooldownEnd) {
      const remainingTime = Math.floor((new Date(savedCooldownEnd) - new Date()) / 1000);
      return remainingTime > 0 ? remainingTime : 0;
    }
    return 8 * 3600; // 8 часов в секундах
  });

  const [hasWon, setHasWon] = useState(false);
  const savedAlpha = parseFloat(localStorage.getItem('overlayAlpha')) || 0;

  const updateAmoritBalance = (amount) => {
    const newBalance = amoritBalance + amount;
    setAmoritBalance(newBalance);
    localStorage.setItem('amoritBalance', newBalance);
  };

  const handleWin = () => {
    updateAmoritBalance(50); // Зачисляем 50 $AMOCOIN за 100 тапов
    triggerConfetti(); // Запуск анимации
  };

  const triggerConfetti = () => {
    if (!confettiActive.current) {
      console.log('Запуск анимации конфетти');
      confettiActive.current = true;
      setShowConfetti(true); // Отображаем конфетти

      setTimeout(() => {
        setShowConfetti(false); // Скрываем конфетти через 3 секунды
        confettiActive.current = false;
        console.log('Анимация конфетти завершена');
      }, 3000);
    }
  };

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = Math.min(canvas.parentElement.offsetWidth, 400);
    canvas.width = size;
    canvas.height = size;

    const image = new Image();
    image.src = characterImage;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      applyOverlay(savedAlpha);
    };
  }, [savedAlpha]);

  const resetGame = useCallback(() => {
    setTapsRemaining(100);
    setIsSessionActive(true);
    setHasWon(false);
    localStorage.removeItem('tapsRemaining');
    localStorage.removeItem('overlayAlpha');
    clearCanvas();
    resizeCanvas();
  }, [resizeCanvas]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    localStorage.setItem('tapsRemaining', tapsRemaining);
  }, [tapsRemaining]);

  useEffect(() => {
    localStorage.setItem('isCooldownActive', JSON.stringify(isCooldownActive));
  }, [isCooldownActive]);

  useEffect(() => {
    if (cooldownTime > 0 && isCooldownActive) {
      const interval = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            resetGame();
            setIsCooldownActive(false);
            return 8 * 3600;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCooldownActive, cooldownTime, resetGame]);

  const handleTap = (e) => {
    if (isSessionActive && tapsRemaining > 0) {
      const newTapsRemaining = tapsRemaining - 1;
      setTapsRemaining(newTapsRemaining);

      const newAlpha = (100 - newTapsRemaining) * 0.005;
      localStorage.setItem('overlayAlpha', newAlpha);

      showFloatingPlusOne(e);
      applyOverlay(newAlpha);

      if (newTapsRemaining === 0) {
        setHasWon(true);
        setIsSessionActive(false);
        handleWin(); // Победа
        startCooldown();
      }
    }
  };

  const showFloatingPlusOne = (e) => {
    const plusOne = document.createElement('div');
    plusOne.className = 'floating-plus-one';
    plusOne.textContent = '+1';
    plusOne.style.left = `${e.clientX}px`;
    plusOne.style.top = `${e.clientY}px`;
    document.body.appendChild(plusOne);
    setTimeout(() => plusOne.remove(), 1500);
  };

  const applyOverlay = (alpha) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Контекст Canvas не найден!');
      return;
    }

    const overlayX = canvas.width * 0.4;
    const overlayY = canvas.height * 0.65;
    const radius = canvas.width * 0.5;

    const gradient = ctx.createRadialGradient(
      overlayX, overlayY, 0,
      overlayX, overlayY, radius
    );

    gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`);
    gradient.addColorStop(0.5, `rgba(255, 0, 0, ${alpha / 2})`);
    gradient.addColorStop(1, `rgba(255, 0, 0, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(overlayX, overlayY, radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  const startCooldown = () => {
    setIsCooldownActive(true);
    const cooldownEnd = new Date(Date.now() + 8 * 3600 * 1000);
    localStorage.setItem('cooldownEnd', cooldownEnd.toISOString());
  };

  const resetCooldownAndGame = () => {
    resetGame();
    setIsCooldownActive(false);
    setCooldownTime(8 * 3600);
    localStorage.removeItem('cooldownEnd');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}ч ${minutes}м ${secs}с`;
  };

  return (
    <div className="tap-game">
      <img src={arrowLeft} alt="Назад" className="back-button" onClick={onBack} />
      <h2>Тапай по попке и&#160;зарабатывай&#160;$AMOCOIN!</h2>
      <h3> {amoritBalance} - Твой текущий баланс</h3>
      <div className="canvas-container">
        <canvas ref={canvasRef} className="tap-canvas" onClick={handleTap} />
      </div>
      <h4>{100 - tapsRemaining} / 100</h4>
      <div className="progress-bar">
        <div style={{ width: `${((100 - tapsRemaining) / 100) * 100}%` }} className="progress" />
        <span>Ты натапал {100 - tapsRemaining} из 100!</span>
      </div>

      {!isSessionActive && hasWon && <h4>Поздравляем! Ты заработал 50 $AMOCOIN за свои 100 тапов!</h4>}

      {isCooldownActive && (
        <>
          <h4>Ты сможешь снова тапать через:</h4>
          <h4>{formatTime(cooldownTime)}</h4>
        </>
      )}

      <button className="reset-button" onClick={resetCooldownAndGame}>
        Сбросить таймер и игру
      </button>

      {showConfetti && (
        <div className="confetti-overlay">
          <ConfettiAnimation />
        </div>
      )}
    </div>
  );
};

export default TapGame;

