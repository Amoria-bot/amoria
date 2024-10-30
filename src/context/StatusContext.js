// src/context/StatusContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const StatusContext = createContext(); // Создаем контекст

export const useStatus = () => useContext(StatusContext); // Хук для доступа к статусам

export const StatusProvider = ({ children }) => {
  const [statuses, setStatuses] = useState({
    alisa: 'offline',
    bob: 'offline',
    clara: 'offline',
    dan: 'offline',
  });

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
