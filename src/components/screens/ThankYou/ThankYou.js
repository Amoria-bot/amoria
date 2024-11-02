import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYou.css';
import ConfettiAnimation from '../../animations/ConfettiAnimation'; // Подключение анимации

const ThankYou = ({ amount }) => {
  const navigate = useNavigate();
  const [amoritBalance, setAmoritBalance] = useState(
    () => parseInt(localStorage.getItem('amoritBalance'), 10) || 0
  );
  const [showConfetti, setShowConfetti] = useState(false); // Управление анимацией

  // Проверяем, обновлялся ли баланс ранее для этого экрана
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
      console.log('Анимация конфетти запущена'); // Лог для проверки анимации
      setTimeout(() => {
        setShowConfetti(false);
        console.log('Анимация конфетти завершена'); // Лог для завершения анимации
      }, 2000);
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
      <h2>Спасибо за покупку!</h2>
      <h3>Поздравляем, ты получил свои $AMOCOIN!</h3>
      <div className="star-animation"></div>

      {/* Отображение баланса */}
      <h1>{amoritBalance}</h1>
      <p>Твой текущий баланс</p>

      <button className="continue-button" onClick={handleContinue}>
        Продолжить
      </button>

      <p>
        Теперь ты можешь использовать $AMOCOIN для доступа к эксклюзивным фото, видео и чатам!
      </p>

      {/* Отображение анимации конфетти */}
      {showConfetti && (
        <div className="confetti-overlay">
          <ConfettiAnimation />
        </div>
      )}
    </div>
  );
};

export default ThankYou;
