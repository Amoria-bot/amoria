import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYou.css';
import ConfettiAnimation from '../../animations/ConfettiAnimation'; // Подключение анимации
import bagTickIcon from '../../../assets/icon/bag-tick.svg'; // Импорт иконки

const ThankYou = ({ amount, isSubscription = false, subscriptionDuration = '1 месяц' }) => {
  const navigate = useNavigate();
  const [amoritBalance, setAmoritBalance] = useState(
    () => parseInt(localStorage.getItem('amoritBalance'), 10) || 0
  );
  const [showConfetti, setShowConfetti] = useState(false); // Управление анимацией
  const [endDate, setEndDate] = useState(null); // Дата окончания подписки

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
    console.log(`isSubscription: ${isSubscription}, subscriptionDuration: ${subscriptionDuration}`);

    if (amount && !isSubscription) {
      updateAmoritBalance(amount);
    }

    if (isSubscription) {
      // Вычисляем дату окончания подписки
      const endDate = new Date();
      if (subscriptionDuration === '1 месяц') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (subscriptionDuration === '1 год') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      const formattedEndDate = endDate.toLocaleDateString();
      console.log(`Установленная дата окончания подписки: ${formattedEndDate}`); // Лог даты окончания
      setEndDate(formattedEndDate);

      // Сохранение информации о подписке в localStorage
      const subscriptionData = {
        type: subscriptionDuration,
        endDate: formattedEndDate,
      };
      localStorage.setItem('activeSubscription', JSON.stringify(subscriptionData));
      console.log('Подписка сохранена в localStorage:', subscriptionData); // Лог сохранения
    }
  }, [amount, updateAmoritBalance, isSubscription, subscriptionDuration]);

  const handleContinue = () => {
    localStorage.removeItem('balanceUpdated'); // Сбрасываем флаг при выходе
    console.log('Флаг balanceUpdated удалён из localStorage'); // Лог удаления флага
    navigate('/characters');
  };

  const handleSelectCharacter = () => {
    navigate('/characters'); // Переход на экран CharacterList
  };

  return (
    <div className="thank-you">
      {isSubscription ? (
        <>
          <h2>Спасибо за оформление подписки!</h2>
          <img src={bagTickIcon} alt="Подписка оформлена" className="thank-you-icon" />
          <h3>Теперь у вас есть доступ ко всем эксклюзивным функциям Amoria!</h3>
          <p>Подписка активирована на {subscriptionDuration}. Дата окончания: {endDate}.</p>
        </>
      ) : (
        <>
          <h2>Спасибо за покупку!</h2>
          <h3>Поздравляем, ты получил свои $AMOCOIN!</h3>
          <div className="star-animation"></div>

          {/* Отображение баланса */}
          <h1>{amoritBalance}</h1>
          <p>Твой текущий баланс</p>
        </>
      )}

      <button className="continue-button" onClick={handleContinue}>
        Продолжить
      </button>

      <p>
        Теперь ты можешь использовать {isSubscription ? 'премиум-функции' : '$AMOCOIN'} для доступа к эксклюзивному контенту!
      </p>

      <button className="select-character-button" onClick={handleSelectCharacter}>
        Выбрать персонажа для общения
      </button>

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
