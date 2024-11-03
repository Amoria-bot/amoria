// src/components/screens/Chat/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './Chat.css';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import { useStatus } from '../../../context/StatusContext';
import SendIcon from '../../../assets/icon/send.svg';
import CameraIcon from '../../../assets/icon/camera.svg';
import MoreIcon from '../../../assets/icon/more.svg';
import arrowLeft from '../../../assets/icon/arrow-left.svg';
import charactersData from '../../../data/characters.json';

const randomReplies = [
  "Прекрасный день для разговора!",
  "Интересная мысль!",
  "Могу я вам чем-то помочь?",
  "Что бы вы хотели обсудить?",
  "Расскажите ещё что-нибудь!",
];

function Chat() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const statuses = useStatus();
  const character = charactersData.find((char) => char.slug === slug);

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(`chat_${slug}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState('');
  const [popupImage, setPopupImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccessRestricted, setIsAccessRestricted] = useState(false);

  const messageEndRef = useRef(null);

  useEffect(() => {
    const checkAccess = () => {
      const savedSubscription = JSON.parse(localStorage.getItem('activeSubscription'));
      const unlockedChats = JSON.parse(localStorage.getItem('unlockedChats')) || [];
      const hasSubscription = savedSubscription && new Date(savedSubscription.endDate) > new Date();
  
      console.log("Проверка доступа к чату:");
      console.log("character.isPremium:", character.isPremium);
      console.log("hasSubscription:", hasSubscription);
      console.log("unlockedChats:", unlockedChats);
  
      if (character.isPremium && !hasSubscription && !unlockedChats.includes(character.id)) {
        console.log("Доступ к чату ограничен.");
        setIsAccessRestricted(true);
      } else {
        console.log("Доступ к чату разрешен.");
        setIsAccessRestricted(false);
      }
    };
  
    checkAccess();
  }, [character]);
  

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatDate = (date) =>
    new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const renderMessages = () => {
    let lastDate = null;
    const messageComponents = [];

    messages.forEach((msg, index) => {
      const messageDate = new Date(msg.timestamp);

      if (!lastDate || !isSameDay(lastDate, messageDate)) {
        messageComponents.push(
          <div key={`date-${index}`} className="date-separator">
            {formatDate(messageDate)}
          </div>
        );
      }

      messageComponents.push(
        <div
          key={index}
          className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
        >
          {msg.media ? (
            <img
              src={msg.media}
              alt="media"
              className="thumbnail"
              onClick={() => handleImageClick(msg.media)}
            />
          ) : (
            <div className="message-content">
              <div className={`message-text ${msg.sender}`}>{msg.text}</div>
            </div>
          )}
          <span className="timestamp">
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      );

      lastDate = messageDate;
    });

    return messageComponents;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isAccessRestricted) return;

    const newMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    localStorage.setItem(`chat_${slug}`, JSON.stringify(updatedMessages));

    generateBotReply(updatedMessages);
  };

  const generateBotReply = (updatedMessages) => {
    setIsTyping(true);
    setIsOnline(true);

    setTimeout(() => {
      const botMessage = {
        sender: 'bot',
        text: randomReplies[Math.floor(Math.random() * randomReplies.length)],
        timestamp: new Date(),
      };

      const newMessages = [...updatedMessages, botMessage];
      setMessages(newMessages);
      setIsTyping(false);
      localStorage.setItem(`chat_${slug}`, JSON.stringify(newMessages));

      setTimeout(() => {
        setIsOnline(false);
      }, 5000);
    }, 5000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || isAccessRestricted) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newMessage = {
        sender: 'user',
        media: reader.result,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem(`chat_${slug}`, JSON.stringify(updatedMessages));

      generateBotReply(updatedMessages);
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = (image) => setPopupImage(image);
  const closePopup = () => setPopupImage(null);
  const handleBack = () => navigate(-1);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem(`chat_${slug}`);
    setIsMenuOpen(false);
  };

  if (!character) return <p>Персонаж не найден!</p>;

  const avatarSrc = character.avatar || character.fallbackAvatar;
  const characterStatus = isTyping || isOnline ? 'online' : statuses[character.slug] || 'offline';

  return (
    <div className="chat-container">
      <div className="chat-header-wrapper">
        <button className="chat-back-button" onClick={handleBack}>
          <img src={arrowLeft} alt="Back" className="arrow-icon" />
        </button>

        <Link to={`/profile/${character.slug}`} className="chat-profile-link">
          <div className="chat-header">
            <div className="chat-avatar">
              <img
                src={avatarSrc}
                alt={character.name}
                className="chat-avatar-img"
                onError={(e) => {
                  e.target.src = character.fallbackAvatar || '';
                }}
              />
            </div>

            <div className="chat-info">
              <span className="chat-name">{character.name}</span>
              <StatusBadge status={characterStatus} />
              <span className="chat-message">
                {isTyping ? "Пишет..." : ""}
              </span>
            </div>
          </div>
        </Link>

        <button className="more-icon-button" onClick={toggleMenu}>
          <img src={MoreIcon} alt="More" className="more-icon" />
        </button>

        {isMenuOpen && (
          <div className="dropdown-menu">
            <button onClick={() => navigate(`/profile/${character.slug}`)}>
              Перейти в профиль
            </button>
            <button onClick={clearChatHistory}>Очистить историю чата</button>
          </div>
        )}
      </div>

      {isAccessRestricted && (
        <div className="access-popup">
          <div className="access-popup-content">
            <p>Доступ к этому чату ограничен. Активируйте подписку или разблокируйте чат за AMOCOIN.</p>
            <button onClick={() => navigate('/star-purchase')}>Пополнить баланс</button>
          </div>
        </div>
      )}

      <div className="messages">{renderMessages()}</div>

      <div className="message-input-wrapper">
        <form onSubmit={handleSend} className="message-input-form">
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введите сообщение..."
              className="message-input"
              disabled={isAccessRestricted}
            />

            <label className="file-label">
              <input type="file" style={{ display: 'none' }} onChange={handleFileChange} disabled={isAccessRestricted} />
              <img src={CameraIcon} alt="Attach" className="input-icon" />
            </label>
          </div>

          <button type="submit" className="send-button" disabled={isAccessRestricted}>
            <img src={SendIcon} alt="Отправить" className="send-icon" />
          </button>
        </form>
      </div>

      {popupImage && (
        <div className="popup" onClick={closePopup}>
          <div className="popup-content">
            <img src={popupImage} alt="Full size" />
            <button className="close-button" onClick={closePopup}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
