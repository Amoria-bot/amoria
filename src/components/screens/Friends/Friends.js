// src/components/screens/Friends/Friends.js
import React, { useEffect, useState } from 'react';
import './Friends.css'; // Импорт стилей из папки styles
import { ReactComponent as CopyIcon } from '../../../assets/icon/copy.svg'; // Импорт иконки

const Friends = ({ referralLink, onCopy }) => {
  const [referrals, setReferrals] = useState([]);

  // Загрузка данных из localStorage при первой загрузке компонента
  useEffect(() => {
    const savedReferrals = JSON.parse(localStorage.getItem('referrals')) || [];
    setReferrals(savedReferrals);
  }, []);

  // Функция для добавления нового друга
  const addFriend = (username) => {
    const newReferrals = [...referrals, { username }];
    setReferrals(newReferrals);
    localStorage.setItem('referrals', JSON.stringify(newReferrals)); // Сохранение в localStorage
  };

  // Функция для сброса списка друзей
  const resetFriends = () => {
    setReferrals([]); // Очищаем состояние
    localStorage.removeItem('referrals'); // Удаляем данные из localStorage
  };

  return (
    <div className="friends">
      <h2>Приглашай друзей и зарабатывай $AMOCOIN!</h2>
      <p>
        Пригласи друзей, и каждый из вас получит по&#160;100&#160;$AMOCOIN. Делись
        ссылкой через мессенджеры или копируй ее.
      </p>

      <div className="button-container">
        <button className="share-button" onClick={() => {/* Логика для поделиться */}}>
          Поделиться
        </button>
        <div className="copy-button" onClick={onCopy}>
          <CopyIcon className="copy-icon" />
        </div>
      </div>

      <h3>Всего друзей приглашено: {referrals.length}</h3>

      <ul>
        {referrals.map((friend, index) => (
          <li key={index}>
            <span className="friend-icon">👤</span> {friend.username}
          </li>
        ))}
      </ul>

      {/* Инпут для добавления нового друга — для тестирования */}
      <input
        type="text"
        placeholder="Введите имя друга"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.value.trim() !== '') {
            addFriend(e.target.value.trim()); // Добавляем друга
            e.target.value = ''; // Очищаем поле
          }
        }}
      />

      {/* Кнопка сброса друзей — для тестирования */}
      <button className="reset-button" onClick={resetFriends}>
        Сбросить друзей
      </button>
    </div>
  );
};

export default Friends;
