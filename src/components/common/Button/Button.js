// src/components/common/Button/Button.js
import React from 'react';
import './Button.css'; // Импорт стилей кнопки

// Импортируем иконки из папки assets/icon
import AddCircleIcon from '../../../assets/icon/add-circle.svg';
import ArrowLeftIcon from '../../../assets/icon/arrow-left.svg';
import ShoppingCartIcon from '../../../assets/icon/shopping-cart.svg';

// Сопоставляем название иконки с файлом SVG
const icons = {
  'add-circle': AddCircleIcon,
  'arrow-left': ArrowLeftIcon,
  'shopping-cart': ShoppingCartIcon,
};

const Button = ({ text, icon, onClick, className = '', variant = 'default' }) => {
  const Icon = icons[icon]; // Определяем иконку по названию
  const buttonClass = `button ${variant === 'secondary' ? 'secondary' : ''} ${className}`;

  return (
    <button className={buttonClass} onClick={onClick}>
      {Icon && <img src={Icon} alt={`${icon} icon`} className="button-icon" />}
      <span>{text}</span>
    </button>
  );
};

export default Button;
