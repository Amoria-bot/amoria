import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYou.css';
import ConfettiAnimation from '../../animations/ConfettiAnimation'; // Импорт анимации

const ThankYou = ({ amount }) => {
  const navigate = useNavigate();
  const [amoritBalance, setAmoritBalance] = useState(
    () => parseInt(localStorage.getItem('amoritBalance'), 10) || 0
  );
  const [showConfetti, setShowConfetti] = useState(false); // Управление анимацией

  // Сброс флага balanceUpdated при монтировании компонента
  useEffect(() => {
    localStorage.removeItem('balanceUpdated');
    console.log('Флаг balanceUpdated сброшен');
  }, []);

  const updateAmoritBalance = useCallback((amount) => {
    const alreadyUpdated = localStorage.getItem('balanceUpdated');

    if (!alreadyUpdated) {
      setAmoritBalance((prevBalance) => {
        const newBalance = prevBalance + amount;
        console.log(`Пополнение на экране благодарности: ${amount}, новый баланс: ${newBalance}`);
        localStorage.setItem('amoritBalance', newBalance);
        localStorage.setItem('balanceUpdated', 'true'); // Помечаем, что пополнение выполнено
        return newBalance;
      });

      // Запуск анимации конфетти
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      console.log('Баланс уже был обновлён ранее.');
    }
  }, []);

  useEffect(() => {
    if (amount) {
      updateAmoritBalance(amount);
    }
  }, [amount, updateAmoritBalance]);

  const handleContinue = () => {
    localStorage.removeItem('balanceUpdated'); // Сбрасываем флаг при выходе
    navigate('/characters');
  };

  return (
    <div className="thank-you">
      {showConfetti && (
        <div className="confetti-overlay">
          <ConfettiAnimation />
        </div>
      )}

      <h2>Спасибо за покупку!</h2>
      <h3>Поздравляем, ты получил свои амориты!</h3>
      <div className="star-animation">🪙</div>

      <h1>{amoritBalance}</h1>
      <p>Твой текущий баланс</p>

      <button className="continue-button" onClick={handleContinue}>
        Продолжить
      </button>

      <p>
        Теперь ты можешь использовать амориты 🪙 для доступа к эксклюзивным фото, видео и чатам!
      </p>
    </div>
  );
};

export default ThankYou;
