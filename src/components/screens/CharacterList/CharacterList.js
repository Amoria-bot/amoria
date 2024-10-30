// src/components/screens/CharacterList/CharacterList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../common/StatusBadge/StatusBadge'; // Импорт компонента статуса
import { useStatus } from '../../../context/StatusContext'; // Импорт контекста статусов
import './CharacterList.css'; // Стили для списка персонажей
import PremiumBadge from '../../../assets/icon/premium-badge.svg'; // Импорт премиум-бейджа
import charactersData from '../../../data/characters.json'; // Импорт JSON с данными персонажей

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const statuses = useStatus(); // Доступ к статусам из контекста

  // Загружаем персонажей из JSON при монтировании компонента
  useEffect(() => {
    setCharacters(charactersData);
  }, []);

  const handleImageError = (e, fallbackSrc) => {
    e.target.src = fallbackSrc;
  };

  return (
    <div className="character-list">
      <h2 className="character-list-title">Выбери персонажа для общения</h2>
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

                {/* Обернули компонент статуса для правильного позиционирования */}
                <div className="character-status-wrapper">
                  <StatusBadge status={statuses[char.slug]} />
                </div>

                <img
                  src={char.avatar}
                  alt={char.name}
                  className="character-image"
                  onError={(e) => handleImageError(e, char.fallbackAvatar)}
                />
                <div className="character-gradient"></div> {/* Градиент */}
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
