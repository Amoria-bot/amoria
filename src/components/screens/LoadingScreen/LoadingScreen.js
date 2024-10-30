import React, { useEffect, useState } from 'react';
import './LoadingScreen.css'; // Поскольку стили находятся в той же папке
import logo from '../../../assets/images/logo.png'; // Исправленный путь к логотипу

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0); // Состояние прогресса

  // Имитируем загрузку с использованием эффекта
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval); // Очищаем интервал, когда загрузка завершена
          return 100; // Устанавливаем прогресс на 100%
        }
        return prevProgress + 1; // Увеличиваем прогресс на 1%
      });
    }, 50); // Интервал 100 мс для достижения 100% за 10 секунд

    return () => clearInterval(interval); // Чистим интервал при размонтировании
  }, []);

  return (
    <div className="loading-screen">
      <img src={logo} alt="Логотип" className="loading-logo" /> {/* Заменяем h1 на изображение */}
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p>{progress}%</p>
    </div>
  );
};

export default LoadingScreen;
