import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wheel } from 'react-custom-roulette';
import './WheelOfFortune.css';
import arrowLeft from '../../../assets/icon/arrow-left.svg';
import ConfettiAnimation from '../../animations/ConfettiAnimation'; // Импорт анимации конфетти

// Массив с данными и весами для каждого сектора
const data = [
  { option: '10 $AMOCOIN', amount: 10, weight: 30, style: { backgroundColor: '#A084E8', textColor: '#ffffff' } },
  { option: '20 $AMOCOIN', amount: 20, weight: 15, style: { backgroundColor: '#856EC1', textColor: '#ffffff' } },
  { option: '50 $AMOCOIN', amount: 50, weight: 15, style: { backgroundColor: '#42f554', textColor: '#000000' } },
  { option: '100 $AMOCOIN', amount: 100, weight: 10, style: { backgroundColor: '#4EBFD6', textColor: '#ffffff' } },
  { option: '150 $AMOCOIN', amount: 150, weight: 5, style: { backgroundColor: '#2FA26B', textColor: '#ffffff' } },
  { option: '300 $AMOCOIN', amount: 300, weight: 2, style: { backgroundColor: '#CB5252', textColor: '#ffffff' } },
  { option: '500 $AMOCOIN', amount: 500, weight: 2, style: { backgroundColor: '#F8D312', textColor: '#000000' } },
  { option: 'Попробуй еще', amount: 0, weight: 21, style: { backgroundColor: '#f16496', textColor: '#000000' } },
];

// Функция для выбора сектора на основе весов
const getRandomPrizeIndex = () => {
  const totalWeight = data.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.floor(Math.random() * totalWeight);

  for (let i = 0; i < data.length; i++) {
    random -= data[i].weight;
    if (random < 0) return i;
  }
  return 0;
};

const WheelOfFortune = () => {
  const navigate = useNavigate();
  const [amoritBalance, setAmoritBalance] = useState(
    parseInt(localStorage.getItem('amoritBalance'), 10) || 0
  );
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [reward, setReward] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCooldownActive, setIsCooldownActive] = useState(
    JSON.parse(localStorage.getItem('isCooldownActive')) || false
  );
  const [cooldownTime, setCooldownTime] = useState(86400); // 24 часа

  const updateAmoritBalance = (amount) => {
    const newBalance = amoritBalance + amount;
    setAmoritBalance(newBalance);
    localStorage.setItem('amoritBalance', newBalance);
  };

  const calculateRemainingTime = () => {
    const lastSpinTime = localStorage.getItem('lastSpinTime');
    if (lastSpinTime) {
      const elapsed = Math.floor((Date.now() - new Date(lastSpinTime).getTime()) / 1000);
      return Math.max(86400 - elapsed, 0);
    }
    return 86400;
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
      const newPrizeNumber = getRandomPrizeIndex(); // Используем функцию для выбора сектора
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const startCooldown = () => {
    setIsCooldownActive(true);
    setCooldownTime(86400);
    localStorage.setItem('lastSpinTime', new Date().toISOString());
  };

  const handleReward = () => {
    const prize = data[prizeNumber];
    setReward(prize.option);

    if (prize.amount > 0) updateAmoritBalance(prize.amount);

    setShowConfetti(true); // Запуск анимации конфетти
    startCooldown();

    setTimeout(() => {
      setShowConfetti(false); // Завершение анимации
    }, 2000);
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
      <h3> {amoritBalance} - Твой текущий баланс $AMOCOIN</h3>

      <div className="wheel-container">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            setMustSpin(false);
            handleReward();
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

      {showConfetti && (
        <div className="confetti-overlay">
          <ConfettiAnimation />
        </div>
      )}
    </div>
  );
};

export default WheelOfFortune;
