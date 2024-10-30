import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wheel } from 'react-custom-roulette';
import './WheelOfFortune.css';
import arrowLeft from '../../../assets/icon/arrow-left.svg';

// Опции колеса фортуны
const data = [
  { option: '10 аморитов', style: { backgroundColor: '#A084E8', textColor: '#ffffff' } },
  { option: '50 аморитов', style: { backgroundColor: '#42f554', textColor: '#000000' } },
  { option: '100 аморитов', style: { backgroundColor: '#4EBFD6', textColor: '#ffffff' } },
  { option: '500 аморитов', style: { backgroundColor: '#F8D312', textColor: '#000000' } },
  { option: '2x выигрыш', style: { backgroundColor: '#CB5252', textColor: '#ffffff' } },
  { option: 'Персонаж', style: { backgroundColor: '#2FA26B', textColor: '#ffffff' } },
  { option: 'Попробуй еще', style: { backgroundColor: '#f16496', textColor: '#000000' } },
  { option: '20 аморитов', style: { backgroundColor: '#856EC1', textColor: '#ffffff' } },
];

const WheelOfFortune = () => {
  const navigate = useNavigate();

  // 1.1: Инициализируем состояние для аморитов
  const [amoritBalance, setAmoritBalance] = useState(
    parseInt(localStorage.getItem('amoritBalance'), 10) || 0
  );

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [reward, setReward] = useState(localStorage.getItem('reward') || null);
  const [isCooldownActive, setIsCooldownActive] = useState(
    JSON.parse(localStorage.getItem('isCooldownActive')) || false
  );
  const [cooldownTime, setCooldownTime] = useState(86400); // 24 часа в секундах

  // 1.2: Функция обновления баланса аморитов
  const updateAmoritBalance = (amount) => {
    const newBalance = amoritBalance + amount;
    setAmoritBalance(newBalance);
    localStorage.setItem('amoritBalance', newBalance);
  };

  // Функция для расчета оставшегося времени
  const calculateRemainingTime = () => {
    const lastSpinTime = localStorage.getItem('lastSpinTime');
    if (lastSpinTime) {
      const elapsed = Math.floor((Date.now() - new Date(lastSpinTime).getTime()) / 1000);
      return Math.max(86400 - elapsed, 0); // Оставшееся время или 0, если прошло 24 часа
    }
    return 86400; // Полный таймер, если время не сохранено
  };

  useEffect(() => {
    const remainingTime = calculateRemainingTime();
    if (remainingTime === 0) {
      setIsCooldownActive(false);
      setReward(null);
      localStorage.removeItem('reward');
    } else if (remainingTime < 86400) {
      setCooldownTime(remainingTime);
      setIsCooldownActive(true);
    }
  }, []);

  const handleBack = () => {
    navigate('/games-and-tasks');
  };

  const handleSpinClick = () => {
    if (!mustSpin && !isCooldownActive) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const startCooldown = () => {
    setIsCooldownActive(true);
    setCooldownTime(86400);
    localStorage.setItem('lastSpinTime', new Date().toISOString());
  };

  // Обработка окончания вращения колеса и начисление награды
  const handleReward = () => {
    const prize = data[prizeNumber].option;
    setReward(prize);
    startCooldown();

    // 1.3: Начисление аморитов за выигрыш
    const amount = parseInt(prize) || 0; // Извлекаем число аморитов из текста
    if (amount > 0) updateAmoritBalance(amount);
  };

  const handleResetCooldown = () => {
    setIsCooldownActive(false);
    setCooldownTime(86400);
    setReward(null);
    localStorage.removeItem('reward');
    localStorage.removeItem('lastSpinTime');
  };

  useEffect(() => {
    if (isCooldownActive) {
      const interval = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsCooldownActive(false);
            setReward(null);
            localStorage.removeItem('reward');
            return 86400;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCooldownActive]);

  useEffect(() => {
    localStorage.setItem('isCooldownActive', JSON.stringify(isCooldownActive));
  }, [isCooldownActive]);

  useEffect(() => {
    localStorage.setItem('cooldownTime', cooldownTime);
  }, [cooldownTime]);

  useEffect(() => {
    if (reward) {
      localStorage.setItem('reward', reward);
    }
  }, [reward]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="wheel-of-fortune">
      <img src={arrowLeft} alt="Назад" className="back-button" onClick={handleBack} />
      <h2>Крути колесо фортуны!</h2>
      <h3>🪙 {amoritBalance} - Твой текущий баланс</h3>

      <div className="wheel-container">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            setMustSpin(false);
            handleReward(); // Обработка награды
          }}
          spinDuration={0.5}
          outerBorderColor="#faece6"
          outerBorderWidth={10}
          radiusLineColor="#e8a084"
          radiusLineWidth={5}
          fontSize={20}
          perpendicularText={false}
        />
      </div>

      <button
        onClick={handleSpinClick}
        disabled={mustSpin || isCooldownActive}
        className={`spin-button ${mustSpin || isCooldownActive ? 'disabled' : ''}`}
      >
        {mustSpin ? 'Крутится...' : isCooldownActive ? 'Ждите...' : 'Крутить'}
      </button>

      {reward && !mustSpin && <h3>Ваша награда: {reward}</h3>}

      {isCooldownActive && (
        <div className="cooldown-info">
          <h4>Следующее вращение через: {formatTime(cooldownTime)}</h4>
          <button onClick={handleResetCooldown} className="reset-button">
            Сбросить ожидание
          </button>
        </div>
      )}
    </div>
  );
};

export default WheelOfFortune;
