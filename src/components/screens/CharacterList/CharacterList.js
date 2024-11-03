// src/components/screens/CharacterList/CharacterList.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import { useStatus } from '../../../context/StatusContext';
import './CharacterList.css';
import PremiumBadge from '../../../assets/icon/premium-badge.svg';
import SubscriptionUpgradeBadge from '../../common/SubscriptionUpgradeBadge/SubscriptionUpgradeBadge';
import charactersData from '../../../data/characters.json';

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [hasSubscription, setHasSubscription] = useState(false); // Проверка подписки
  const statuses = useStatus();
  const navigate = useNavigate();

  useEffect(() => {
    setCharacters(charactersData);

    // Логируем начало проверки подписки
    console.log("Проверка подписки в localStorage...");
    const savedSubscription = JSON.parse(localStorage.getItem('activeSubscription'));

    if (savedSubscription) {
      console.log("Подписка найдена в localStorage:", savedSubscription);

      if (savedSubscription.endDate) {
        const subscriptionEndDate = new Date(savedSubscription.endDate);
        const currentDate = new Date();
        console.log("Дата окончания подписки:", subscriptionEndDate);
        console.log("Текущая дата:", currentDate);

        if (subscriptionEndDate > currentDate) {
          setHasSubscription(true);
          console.log("Подписка активна до:", savedSubscription.endDate);
        } else {
          console.log("Подписка истекла. Удаляем просроченную подписку из localStorage.");
          localStorage.removeItem('activeSubscription');
          setHasSubscription(false);
        }
      } else {
        console.log("Дата окончания подписки не найдена. Устанавливаем hasSubscription в false.");
        setHasSubscription(false);
      }
    } else {
      console.log("Подписка отсутствует в localStorage. Устанавливаем hasSubscription в false.");
      setHasSubscription(false);
    }
  }, []);

  const handleImageError = (e, fallbackSrc) => {
    e.target.src = fallbackSrc;
  };

  return (
    <div className="character-list">
      <h2 className="character-list-title">Выбери персонажа для общения</h2>

      {/* Отображение бейджа только при отсутствии подписки */}
      {!hasSubscription && (
        <div onClick={() => navigate('/star-purchase')} style={{ width: '100%' }}>
          <SubscriptionUpgradeBadge />
        </div>
      )}

      <ul>
        {characters.map((char) => (
          <li key={char.id} className="character-item">
            <Link to={`/profile/${char.slug}`} className="character-link">
              <div className="character-image-wrapper">
                {char.isPremium && (
                  <img 
                    src={PremiumBadge} 
                    alt="Premium Badge" 
                    className="premium-badge" 
                  />
                )}
                <div className="character-status-wrapper">
                  <StatusBadge status={statuses[char.slug]} />
                </div>
                <img
                  src={char.avatar}
                  alt={char.name}
                  className="character-image"
                  onError={(e) => handleImageError(e, char.fallbackAvatar)}
                />
                <div className="character-gradient"></div>
                <div className="character-info">
                  <div className="character-info-name">{char.name}</div>
                  <p className="character-description">{char.shortDescription}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CharacterList;
