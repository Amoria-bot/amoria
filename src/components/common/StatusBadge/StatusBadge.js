// src/components/common/StatusBadge/StatusBadge.js
import React from 'react';
import './StatusBadge.css'; // Импортируем стили

function StatusBadge({ status }) {
  return (
    <div className="character-status">
      <div className={`status-indicator ${status}`}></div>
      <p className="status-text">{status === 'online' ? 'онлайн' : 'офлайн'}</p>
    </div>
  );
}

export default StatusBadge;
