import { useLocation } from 'react-router-dom';
import { useTelegram } from '../contexts/TelegramContext';
import { backButtonUtils } from '../utils/telegramUtils';
import { useEffect } from 'react';

const Header = () => {
  const location = useLocation();
  const { theme } = useTelegram();
  
  // Получаем заголовок в зависимости от текущего маршрута
  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Карта квестов';
      case '/leaderboard':
        return 'Таблица лидеров';
      case '/profile':
        return 'Профиль';
      default:
        return 'LeafQuest';
    }
  };
  
  // Управляем кнопкой "Назад" в зависимости от маршрута
  useEffect(() => {
    if (location.pathname === '/') {
      backButtonUtils.hide();
    } else {
      backButtonUtils.show();
    }
    
    // Очистка при размонтировании
    return () => {
      backButtonUtils.hide();
    };
  }, [location.pathname]);
  
  return (
    <header className={`app-header ${theme}`}>
      <h1>{getTitle()}</h1>
    </header>
  );
};

export default Header; 