// src/components/screens/RewardScreen/RewardScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import './RewardScreen.css';
import rewardImage from '../../../assets/images/reward.png'; // Импорт изображения
import Button from '../../common/Button/Button'; // Импорт кнопки

const RewardScreen = ({ streak, onClose }) => {
  const [reward, setReward] = useState(0); // Текущая награда

  // Функция для обновления баланса
  const updateAmoritBalance = useCallback((amount) => {
    const prevBalance = parseInt(localStorage.getItem('amoritBalance'), 10) || 0;
    const newBalance = prevBalance + amount;
    localStorage.setItem('amoritBalance', newBalance); // Обновление LocalStorage
  }, []);

  // Логика расчёта награды в зависимости от стрика
  useEffect(() => {
    const calculatedReward = streak >= 10 ? 100 : streak * 10;
    setReward(calculatedReward); // Устанавливаем награду
    updateAmoritBalance(calculatedReward); // Обновляем баланс
  }, [streak, updateAmoritBalance]);

  return (
    <div className="reward-screen">
      <img src={rewardImage} alt="Reward" className="reward-image" />
      <h1>ДЕНЬ {streak}</h1>
      <div className="reward-info">
        <p>Ты получил {reward} аморитов за свой {streak}-й день!</p>
        <p>Вернись завтра, чтобы получить ещё больше аморитов!</p>
      </div>
      <div className="continue-button">
        <Button onClick={onClose} text="Продолжить" />
      </div>
    </div>
  );
};

export default RewardScreen;
