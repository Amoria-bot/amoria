// src/components/common/BottomNavbar/BottomNavbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNavbar.css'; 

// Правильные пути к иконкам
import chatIcon from '../../../assets/icon/chat-icon.svg';
import chatIconActive from '../../../assets/icon/chat-icon-act.svg';
import gamesIcon from '../../../assets/icon/games-icon.svg';
import gamesIconActive from '../../../assets/icon/games-icon-act.svg';
import charactersIcon from '../../../assets/icon/characters-icon.svg';
import charactersIconActive from '../../../assets/icon/characters-icon-act.svg';
import starsIcon from '../../../assets/icon/coin-icon.svg';
import starsIconActive from '../../../assets/icon/coin-icon-act.svg';
import friendsIcon from '../../../assets/icon/friends-icon.svg';
import friendsIconActive from '../../../assets/icon/friends-icon-act.svg';

function BottomNavbar() {
  const location = useLocation();

  const menuItems = [
    { label: 'Чаты', icon: chatIcon, activeIcon: chatIconActive, route: '/chats' },
    { label: 'Игры', icon: gamesIcon, activeIcon: gamesIconActive, route: '/games-and-tasks' },
    { label: 'Персонажи', icon: charactersIcon, activeIcon: charactersIconActive, route: '/characters' },
    { label: 'Баланс', icon: starsIcon, activeIcon: starsIconActive, route: '/star-purchase' },
    { label: 'Друзья', icon: friendsIcon, activeIcon: friendsIconActive, route: '/friends' },
  ];

  return (
    <div className="bottom-navbar">
      {menuItems.map((item, index) => {
        const isActive = location.pathname === item.route;

        return (
          <Link
            key={index}
            to={item.route}
            className={`navbar-item ${isActive ? 'active' : ''}`}
          >
            <div className="navbar-icon">
              <img src={isActive ? item.activeIcon : item.icon} alt={item.label} />
            </div>
            <div className="navbar-label">{item.label}</div>
          </Link>
        );
      })}
    </div>
  );
}

export default BottomNavbar;
