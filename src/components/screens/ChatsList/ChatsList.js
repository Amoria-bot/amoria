// src/components/screens/Chat/ChatsList.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatsList.css';
import PremiumBadge from '../../../assets/icon/premium-badge.svg'; // Импорт премиум-бейджа
import charactersData from '../../../data/characters.json'; // Импорт JSON с персонажами

const importAllAvatars = (context) =>
  context.keys().reduce((acc, key) => {
    const filename = key.split('/').pop();
    acc[filename] = context(key).default || context(key);
    return acc;
  }, {});

const avatars = importAllAvatars(
  require.context('/public/images/character', true, /\.(png|jpe?g|svg|webp)$/)
);
console.log('avatars:', avatars); // Логируем объект avatars

function ChatsList() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [statuses, setStatuses] = useState({});
  const imgRefs = useRef({});

  // Загружаем данные персонажей из JSON при монтировании компонента
  useEffect(() => {
    console.log('Загрузка данных персонажей:', charactersData); // Лог данных из JSON
    setCharacters(charactersData);

    const initialStatuses = charactersData.reduce((acc, char) => {
      acc[char.slug] = 'офлайн';
      return acc;
    }, {});
    setStatuses(initialStatuses);
  }, []);

  useEffect(() => {
    console.log('Загруженные персонажи:', characters); // Лог состояния персонажей
    characters.forEach((char) => {
      console.log(`Проверка аватара для: ${char.name} - ${char.avatar}`); // Лог каждого аватара
      const img = new Image();
      img.src = avatars[char.avatar];

      img.onerror = () => {
        console.log(`Ошибка загрузки аватара для: ${char.name}, переключаем на fallback`);
        if (imgRefs.current[char.slug]) {
          imgRefs.current[char.slug].src = avatars[char.fallbackAvatar] || '';
        }
      };
    });
  }, [characters]);

  const chats = characters.map((char) => {
    const savedMessages = JSON.parse(localStorage.getItem(`chat_${char.slug}`)) || [];
    const lastMessage = savedMessages[savedMessages.length - 1] || {
      text: 'Нет сообщений',
      timestamp: new Date(),
    };

    const unreadMessages = savedMessages.filter(
      (msg) => msg.sender === 'bot' && msg.read === false
    );

    return {
      characterSlug: char.slug,
      lastMessage: lastMessage.text,
      timestamp: new Date(lastMessage.timestamp),
      unread: unreadMessages.length,
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStatuses((prevStatuses) => {
        const newStatuses = { ...prevStatuses };
        characters.forEach((char) => {
          const isOnline = Math.random() > 0.5;
          newStatuses[char.slug] = isOnline ? 'онлайн' : 'офлайн';
        });
        return newStatuses;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [characters]);

  const handleChatClick = (slug) => navigate(`/chat/${slug}`);

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 60000);

    if (diff < 1) return 'Только что';
    if (diff < 60) return `${diff} мин назад`;
    if (diff < 1440) return `${Math.floor(diff / 60)} ч назад`;
    if (diff < 2880) return 'Вчера';
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="chat-list-container">
      <h2>Ваши Чаты</h2>

      {chats.length === 0 ? (
        <div className="empty-state">
          <p>У вас нет активных чатов.</p>
        </div>
      ) : (
        chats.map((chat, index) => {
          const character = characters.find((char) => char.slug === chat.characterSlug);
          console.log('Рендер персонажа:', character); // Лог текущего персонажа
          return (
            <div
              key={index}
              className="chat-item"
              onClick={() => handleChatClick(chat.characterSlug)}
            >
              <div className="chat-avatar-wrapper">

                <img
                  src={character.avatar.replace('.jpg', '.webp')}  // Пытаемся загрузить WebP
                  alt={character.name}
                  className="chat-avatar"
                  ref={(el) => (imgRefs.current[character.slug] = el)}
                  onError={(e) => {
                    console.log(`Ошибка загрузки WebP для: ${character.name}, переключаем на fallback`);
                    e.target.src = character.fallbackAvatar; // Переключаем на JPG
                  }}
                />

                <div
                  className={`status-indicator chat-status-indicator ${
                    statuses[character.slug] === 'онлайн' ? 'online' : 'offline'
                  }`}
                ></div>
              </div>

              <div className="chat-info">
                <div className="chat-header">
                  <span className="chat-name">{character.name}</span>
                  {character.isPremium && (
                    <img
                      src={PremiumBadge}
                      alt="Премиум"
                      className="premium-badge chat-premium-badge"
                    />
                  )}
                </div>
                <div className="chat-message">
                  {chat.lastMessage.length > 30
                    ? `${chat.lastMessage.substring(0, 30)}...`
                    : chat.lastMessage}
                </div>
                <div className="chat-timestamp">{formatTime(chat.timestamp)}</div>
              </div>

              {chat.unread > 0 && (
                <div className="notification-badge">{chat.unread}</div>
              )}
            </div>
          );
        })
      )}

      <div className="fab-button-container">
        <button className="fab-button" onClick={() => navigate('/characters')}>
          +
        </button>
      </div>
    </div>
  );
}

export default ChatsList;
