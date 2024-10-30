// src/components/screens/Counter/Counter.js
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // Инициализация состояния

  const increment = () => setCount(count + 1); // Увеличение счётчика

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h3>Счётчик: {count}</h3>
      <button onClick={increment}>Увеличить</button>
    </div>
  );
}

export default Counter;
