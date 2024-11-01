import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import { useStatus } from '../../../context/StatusContext';
import './CharacterProfile.css';
import LikeIcon from '../../../assets/icon/like.svg';
import DislikeIcon from '../../../assets/icon/dislike.svg';
import arrowLeft from '../../../assets/icon/arrow-left.svg';
import LockIcon from '../../../assets/icon/lock.svg'; // Импортируем иконку
import charactersData from '../../../data/characters.json';

// Получение и обновление баланса из localStorage с проверкой значения
const getBalance = () => {
  const storedBalance = parseInt(localStorage.getItem('amoritBalance'), 10);
  console.log("Считываем баланс из localStorage:", storedBalance);
  return isNaN(storedBalance) ? 0 : storedBalance; // Если значение NaN, возвращаем 0
};
const updateBalance = (newBalance) => {
  localStorage.setItem('amoritBalance', newBalance);
  console.log("Обновляем баланс в localStorage:", newBalance);
};

// Функция для получения разблокированных премиум-изображений из localStorage
const getUnlockedPremiumImages = (characterId) => {
  const unlockedImages = JSON.parse(localStorage.getItem(`unlockedImages-${characterId}`)) || [];
  return unlockedImages;
};

// Функция для обновления разблокированных премиум-изображений в localStorage
const updateUnlockedPremiumImages = (characterId, imageIndex) => {
  const unlockedImages = getUnlockedPremiumImages(characterId);
  if (!unlockedImages.includes(imageIndex)) {
    unlockedImages.push(imageIndex);
    localStorage.setItem(`unlockedImages-${characterId}`, JSON.stringify(unlockedImages));
  }
};

function CharacterProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const statuses = useStatus();
  const character = charactersData.find((char) => char.slug === slug);

  const [popupImage, setPopupImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [balance, setBalance] = useState(() => getBalance());
  const [showBalancePopup, setShowBalancePopup] = useState(false);
  const [showGalleryPopup, setShowGalleryPopup] = useState(false);
  const [showConfirmUnlockPopup, setShowConfirmUnlockPopup] = useState(false);
  const [showPremiumConfirmUnlockPopup, setShowPremiumConfirmUnlockPopup] = useState(false);
  const [selectedPremiumImage, setSelectedPremiumImage] = useState(null);
  const [unlockedPremiumImages, setUnlockedPremiumImages] = useState([]);

  useEffect(() => {
    const unlockedCharacters = JSON.parse(localStorage.getItem('unlockedCharacters')) || [];
    if (unlockedCharacters.includes(character.id)) setIsUnlocked(true);

    const storedLikes = localStorage.getItem(`${slug}-likes`);
    const storedDislikes = localStorage.getItem(`${slug}-dislikes`);
    const voted = localStorage.getItem(`${slug}-voted`);
    const storedComments = localStorage.getItem(`${slug}-comments`);

    if (storedLikes) setLikes(parseInt(storedLikes, 10));
    if (storedDislikes) setDislikes(parseInt(storedDislikes, 10));
    if (voted) setHasVoted(true);
    if (storedComments) setComments(JSON.parse(storedComments));

    setBalance(getBalance()); // Установка баланса при загрузке компонента

    // Получение разблокированных премиум-изображений из localStorage
    setUnlockedPremiumImages(getUnlockedPremiumImages(character.id));
  }, [slug, character.id]);

  const handleUnlock = () => {
    if (balance >= 1000) {
      setShowConfirmUnlockPopup(true);
    } else {
      setShowBalancePopup(true);
    }
  };

  const confirmUnlock = () => {
    const newBalance = balance - 1000;
    updateBalance(newBalance);
    setBalance(newBalance);

    const unlockedCharacters = JSON.parse(localStorage.getItem('unlockedCharacters')) || [];
    unlockedCharacters.push(character.id);
    localStorage.setItem('unlockedCharacters', JSON.stringify(unlockedCharacters));

    setIsUnlocked(true);
    setShowConfirmUnlockPopup(false);
  };

  const handlePremiumUnlock = (img, index) => {
    if (unlockedPremiumImages.includes(index)) {
      // Если изображение уже разблокировано, сразу показываем попап
      setPopupImage(img.src || img.webp || img.jpg);
      setShowGalleryPopup(true);
      return;
    }
    if (balance >= 50) { // Списываем 50 аморитов для изображения
      setSelectedPremiumImage(img);
      setCurrentIndex(index);
      setShowPremiumConfirmUnlockPopup(true);
    } else {
      setShowBalancePopup(true);
    }
  };

  const confirmPremiumUnlock = () => {
    const newBalance = balance - 50;
    updateBalance(newBalance);
    setBalance(newBalance);
    setShowPremiumConfirmUnlockPopup(false);

    // Сохраняем разблокированное изображение в localStorage и обновляем стейт
    updateUnlockedPremiumImages(character.id, currentIndex);
    setUnlockedPremiumImages((prev) => [...prev, currentIndex]);

    setPopupImage(selectedPremiumImage.src || selectedPremiumImage.webp || selectedPremiumImage.jpg);
    setShowGalleryPopup(true);
  };

  const resetUnlockedChats = () => {
    localStorage.removeItem('unlockedCharacters');
    localStorage.removeItem(`unlockedImages-${character.id}`); // Сброс премиум-изображений
    setIsUnlocked(false);
    setUnlockedPremiumImages([]); // Сброс состояния разблокированных изображений
  };
  
  const closePopup = () => {
    setShowBalancePopup(false);
    setShowConfirmUnlockPopup(false);
    setShowPremiumConfirmUnlockPopup(false);
  };

  const handleBuyAmorites = () => navigate('/star-purchase');

  const openPopup = (img, index) => {
    setPopupImage(img.src || img.webp || img.jpg);
    setCurrentIndex(index);
    setShowGalleryPopup(true);
  };

  const closeImagePopup = () => setShowGalleryPopup(false);

  const handleNextImage = () => {
    const nextIndex = (currentIndex + 1) % character.gallery.length;
    openPopup(character.gallery[nextIndex], nextIndex);
  };

  const handlePrevImage = () => {
    const prevIndex = (currentIndex - 1 + character.gallery.length) % character.gallery.length;
    openPopup(character.gallery[prevIndex], prevIndex);
  };

  const handleBack = () => navigate(-1);

  const handleLike = () => {
    if (!hasVoted) {
      setLikes(likes + 1);
      setHasVoted(true);
      localStorage.setItem(`${slug}-likes`, likes + 1);
      localStorage.setItem(`${slug}-voted`, 'true');
    }
  };

  const handleDislike = () => {
    if (!hasVoted) {
      setDislikes(dislikes + 1);
      setHasVoted(true);
      localStorage.setItem(`${slug}-dislikes`, dislikes + 1);
      localStorage.setItem(`${slug}-voted`, 'true');
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() === '') {
      setError('Комментарий не может быть пустым!');
      return;
    }
    setError('');
    const newComments = [...comments, comment];
    setComments(newComments);
    setComment('');
    localStorage.setItem(`${slug}-comments`, JSON.stringify(newComments));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
  });

  if (!character) return <p>Персонаж не найден!</p>;

  return (
    <>
      <div className="character-profile">
        <button onClick={handleBack} className="back-button">
          <img src={arrowLeft} alt="Назад" className="back-icon" />
        </button>

        <img
          src={character.imageWebp || character.imageJpeg}
          alt={character.name}
          className="character-image"
          onError={(e) => (e.target.src = character.imageJpeg)}
          onClick={() => openPopup({ src: character.imageJpeg }, -1)}
        />

        <StatusBadge status={statuses[character.slug]} />

        <h2>{character.name}</h2>
        <p>{character.fullDescription || character.description}</p>

        <h3>Галерея</h3>
        <div className="gallery">
          {character.gallery.map((img, index) => (
            <img
              key={index}
              src={img.webp || img.jpg}
              alt={`Gallery ${index + 1}`}
              onError={(e) => (e.target.src = img.jpg)}
              onClick={() => openPopup(img, index)}
              className="gallery-image"
            />
          ))}
        </div>

        <h3>Премиум Галерея</h3>
        <div className="premium-gallery">
          {character.premiumPhotos.map((img, index) => (
            <div
              key={index}
              className="premium-gallery-image-container"
              onClick={() => handlePremiumUnlock(img, index)}
            >
              <img
                src={img.webp || img.jpg}
                alt={`Premium ${index + 1}`}
                onError={(e) => (e.target.src = img.jpg)}
                className={`premium-gallery-image ${unlockedPremiumImages.includes(index) ? 'unlocked' : 'blurred'}`}
              />
              {!unlockedPremiumImages.includes(index) && (
                <div className="lock-overlay">
                  <img src={LockIcon} alt="Замок" className="lock-icon" />
                </div>
              )}
            </div>
          ))}
        </div>

      {!isUnlocked && character.isPremium ? (
        <button className="unlock-button" onClick={handleUnlock}>
          Разблокировать чат с {character.name} за 1000 🪙
        </button>
      ) : (
        <button className="chat-button" onClick={() => navigate(`/chat/${character.slug}`)}>
          Открыть чат с {character.name}
        </button>
      )}

      <div className="like-dislike-container">
        <div className={`like-button-container ${hasVoted ? 'disabled' : ''}`} onClick={handleLike}>
          <img src={LikeIcon} alt="Like" />
          <span>{likes}</span>
        </div>

        <div className={`dislike-button-container ${hasVoted ? 'disabled' : ''}`} onClick={handleDislike}>
          <img src={DislikeIcon} alt="Dislike" />
          <span>{dislikes}</span>
        </div>
      </div>
      {hasVoted && <span className="vote-message">Вы уже голосовали!</span>}

      {showBalancePopup && (
        <div className="balance-popup-overlay" onClick={closePopup}>
          <div className="balance-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePopup}>×</button>
            <h3>Недостаточно аморитов!</h3>
            <p>Ваш баланс: {balance} 🪙</p>
            <p>У вас недостаточно аморитов для разблокировки элемента.</p>
            <button onClick={handleBuyAmorites}>
              Купить Амориты
            </button>
          </div>
        </div>
      )}

      {showConfirmUnlockPopup && (
        <div className="balance-popup-overlay" onClick={closePopup}>
          <div className="balance-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePopup}>×</button>
            <h3>Разблокировка чата с премиум-персонажем</h3>
            <p>Ваш текущий баланс аморитов: {balance} 🪙</p>
            <p>Списываем 1000 аморитов за разблокировку чата с {character.name}.</p>
            <button onClick={confirmUnlock}>Продолжить</button>
          </div>
        </div>
      )}

      {showPremiumConfirmUnlockPopup && (
        <div className="balance-popup-overlay" onClick={closePopup}>
          <div className="balance-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePopup}>×</button>
            <h3>Разблокировка премиум-изображения</h3>
            <p>Ваш текущий баланс аморитов: {balance} 🪙</p>
            <p>Списываем 50 аморитов за разблокировку изображения.</p>
            <button onClick={confirmPremiumUnlock}>Продолжить</button>
          </div>
        </div>
      )}

      {showGalleryPopup && (
        <div className="popup" {...swipeHandlers} onClick={(e) => e.stopPropagation()}>
          <div className="popup-content">
            <button className="close-button" onClick={closeImagePopup}>×</button>
            <button className="prev-button" onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}>←</button>
            <img src={popupImage} alt="Full size" />
            <button className="next-button" onClick={(e) => { e.stopPropagation(); handleNextImage(); }}>→</button>
          </div>
        </div>
      )}

      <form onSubmit={handleCommentSubmit}>
        <div className="comment-input-container">
          <textarea
            className="comment-input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Оставьте комментарий"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">Отправить</button>
      </form>

      <ul className="comments">
        {comments.map((comm, index) => (
          <li key={index} className="comment-container">
            <span className="comment-username">Пользователь {index + 1}</span>
            <p>{comm}</p>
          </li>
        ))}
      </ul>

      {/* Кнопка для сброса разблокированных чатов */}
      <button className="reset-button" onClick={resetUnlockedChats}>
        Сбросить разблокировки
      </button>
      </div>
    </>
  );
}

export default CharacterProfile;
