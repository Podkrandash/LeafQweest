import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TelegramProvider } from './contexts/TelegramContext';
import MapPage from './pages/MapPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import LoadingScreen from './components/LoadingScreen';
// Удаляем импорт Header
// Импортируем новые стили
import './styles/AppDark.css';
import './styles/Navbar.css';
import './styles/ProfilePage.css';
import './styles/LeaderboardPage.css';
import './styles/Map.css';
import './styles/QuestCard.css';
import './styles/QuestsPage.css';
import './styles/QuestDetail.css';
import './styles/Forms.css';
import './styles/Modals.css';
import './styles/HomePage.css';
import './styles/AchievementsPage.css';
import './styles/LoadingScreen.css';

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Инициализируем Telegram Web App при загрузке
  useEffect(() => {
    // Сообщаем Telegram, что приложение готово
    WebApp.ready();
    
    // Разворачиваем приложение на весь экран
    WebApp.expand();
    
    // Запрещаем приложению сжиматься
    WebApp.isExpanded = true;
    
    // Устанавливаем заголовок
    WebApp.setHeaderColor('#1f2937');
    
    // Запрещаем закрытие без подтверждения
    WebApp.enableClosingConfirmation();
    
    // Настраиваем кнопку назад
    WebApp.BackButton.onClick(() => {
      window.history.back();
    });

    // Добавляем обработчик на событие попытки сворачивания
    WebApp.onEvent('viewportChanged', ({ isStateStable }) => {
      if (isStateStable && !WebApp.isExpanded) {
        WebApp.expand();
      }
    });

    // Имитация загрузки всего приложения
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);
    
    return () => {
      // Отключаем обработчики при размонтировании
      WebApp.onEvent('backButtonClicked', () => {});
      WebApp.onEvent('viewportChanged', () => {});
      clearTimeout(timer);
    };
  }, []);

  if (isInitialLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  return (
    <TelegramProvider>
      <Router>
        <div className="app-container">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<MapPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
          <Navbar />
        </div>
      </Router>
    </TelegramProvider>
  );
}

export default App;
