// src/context/StatusContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import charactersData from '../data/characters.json'; // Импортируем JSON с персонажами

const StatusContext = createContext(); // Создаем контекст

export const useStatus = () => useContext(StatusContext); // Хук для доступа к статусам

export const StatusProvider = ({ children }) => {
  // Инициализируем статусы на основе JSON
  const initialStatuses = Object.fromEntries(
    charactersData.map((char) => [char.slug, 'offline'])
  );

  const [statuses, setStatuses] = useState(initialStatuses);

  // Обновление статусов каждые 10 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setStatuses((prevStatuses) =>
        Object.fromEntries(
          Object.entries(prevStatuses).map(([key]) => [
            key,
            Math.random() > 0.5 ? 'online' : 'offline',
          ])
        )
      );
    }, 10000);

    return () => clearInterval(interval); // Очищаем таймер при размонтировании
  }, []);

  return (
    <StatusContext.Provider value={statuses}>
      {children}
    </StatusContext.Provider>
  );
};
