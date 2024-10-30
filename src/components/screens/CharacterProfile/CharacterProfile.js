import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import { useStatus } from '../../../context/StatusContext';
import './CharacterProfile.css';
import LikeIcon from '../../../assets/icon/like.svg';
import DislikeIcon from '../../../assets/icon/dislike.svg';
import arrowLeft from '../../../assets/icon/arrow-left.svg';
import charactersData from '../../../data/characters.json';

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

  const openPopup = (img, index) => {
    setPopupImage(img.src || img.webp || img.jpg); // Открываем нужное изображение
    setCurrentIndex(index); // Устанавливаем текущий индекс
  };

  const closePopup = () => setPopupImage(null);

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
      const newLikes = likes + 1;
      setLikes(newLikes);
      setHasVoted(true);
      localStorage.setItem(`${slug}-likes`, newLikes);
      localStorage.setItem(`${slug}-voted`, 'true');
    }
  };

  const handleDislike = () => {
    if (!hasVoted) {
      const newDislikes = dislikes + 1;
      setDislikes(newDislikes);
      setHasVoted(true);
      localStorage.setItem(`${slug}-dislikes`, newDislikes);
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

  useEffect(() => {
    const storedLikes = localStorage.getItem(`${slug}-likes`);
    const storedDislikes = localStorage.getItem(`${slug}-dislikes`);
    const voted = localStorage.getItem(`${slug}-voted`);
    const storedComments = localStorage.getItem(`${slug}-comments`);

    if (storedLikes) setLikes(parseInt(storedLikes, 10));
    if (storedDislikes) setDislikes(parseInt(storedDislikes, 10));
    if (voted) setHasVoted(true);
    if (storedComments) setComments(JSON.parse(storedComments));
  }, [slug]);

  if (!character) return <p>Персонаж не найден!</p>;

  return (
    <div className="character-profile">
      <button onClick={handleBack} className="back-button">
        <img src={arrowLeft} alt="Назад" className="back-icon" />
      </button>

      <img
        src={character.imageWebp || character.imageJpeg}
        alt={character.name}
        className="character-image"
        onError={(e) => {
          e.target.src = character.imageJpeg;
        }}
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
            onError={(e) => {
              console.log(`Ошибка загрузки WebP для ${img.webp}, переключаем на JPEG`);
              e.target.src = img.jpg;
            }}
            onClick={() => openPopup(img, index)}
            className="gallery-image"
          />
        ))}
      </div>

      <button className="chat-button" onClick={() => navigate(`/chat/${character.slug}`)}>
        Открыть чат с {character.name}
      </button>

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
      {hasVoted && <span className={`vote-message`}>Вы уже голосовали!</span>}

      {popupImage && (
        <div className="popup" {...swipeHandlers} onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePopup}>×</button>
            <button className="prev-button" onClick={handlePrevImage}>←</button>
            <img src={popupImage} alt="Full size" />
            <button className="next-button" onClick={handleNextImage}>→</button>
          </div>
        </div>
      )}

      <h3>Что ты думаешь об этом персонаже?</h3>
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
            <div className="comment-body">{comm}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CharacterProfile;
