import React, { useEffect, useState, useCallback, useRef } from 'react';
import './RewardScreen.css';
import rewardImage from '../../../assets/images/reward.png'; // Импорт изображения
import Button from '../../common/Button/Button'; // Импорт кнопки
import ConfettiAnimation from '../../animations/ConfettiAnimation'; // Импорт анимации

const RewardScreen = ({ streak, onClose }) => {
  const [reward, setReward] = useState(0); // Текущая награда
  const [showConfetti, setShowConfetti] = useState(false); // Управление анимацией
  const confettiActive = useRef(false); // Контроль активации анимации

  // Функция для обновления баланса
  const updateAmoritBalance = useCallback((amount) => {
    const prevBalance = parseInt(localStorage.getItem('amoritBalance'), 10) || 0;
    const newBalance = prevBalance + amount;
    localStorage.setItem('amoritBalance', newBalance); // Обновление LocalStorage
    console.log(`Баланс обновлён: ${prevBalance} + ${amount} = ${newBalance}`);
  }, []);

  // Логика расчёта награды в зависимости от стрика
  useEffect(() => {
    const initialBalance = parseInt(localStorage.getItem('amoritBalance'), 10) || 0;
    console.log("Начальный баланс $AMOCOIN:", initialBalance); // Лог для начального баланса

    const calculatedReward = streak >= 10 ? 100 : streak * 10;
    setReward(calculatedReward); // Устанавливаем награду
    updateAmoritBalance(calculatedReward); // Обновляем баланс
    console.log("Вычисленная награда:", calculatedReward); // Лог для награды

    // Показываем конфетти только если день не пропущен
    if (streak > 0 && !confettiActive.current) {
      confettiActive.current = true;
      setShowConfetti(true);
      console.log('Запуск анимации конфетти для награды');

      setTimeout(() => {
        setShowConfetti(false);
        confettiActive.current = false;
        console.log('Анимация конфетти завершена');
      }, 2000); // Конфетти отображается 3 секунды
    }
  }, [streak, updateAmoritBalance]);

  return (
    <div className="reward-screen">
      <img src={rewardImage} alt="Reward" className="reward-image" />
      <h1>ДЕНЬ {streak}</h1>
      <div className="reward-info">
        <p>Ты получил {reward} $AMOCOIN<br/>за свой {streak}-й день!</p>
        <p>Вернись завтра,<br/>чтобы получить ещё больше!</p>
      </div>
      <div className="continue-button">
        <Button onClick={onClose} text="Продолжить" />
      </div>

      {showConfetti && (
        <div className="confetti-overlay">
          <ConfettiAnimation />
        </div>
      )}
    </div>
  );
};

export default RewardScreen;
