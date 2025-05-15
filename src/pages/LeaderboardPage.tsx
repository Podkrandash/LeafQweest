import { useState, useEffect, useRef } from 'react';
import { useTelegram } from '../contexts/TelegramContext';
import { leaderboardApi } from '../api/api';
import type { LeaderboardEntry } from '../types';
import '../styles/LeaderboardPage.css';

const LeaderboardPage = () => {
  const { user, theme } = useTelegram();
  const [activeTab, setActiveTab] = useState<'global' | 'weekly'>('global');
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  
  const leaderboardRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // Загрузка данных таблицы лидеров при монтировании компонента
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Получаем данные для глобальной и недельной таблицы лидеров
        const [globalData, weeklyData] = await Promise.all([
          leaderboardApi.getLeaderboard('global'),
          leaderboardApi.getLeaderboard('weekly')
        ]);
        
        // Обрабатываем глобальные данные, помечая текущего пользователя
        if (user && globalData) {
          const processedGlobalData = globalData.map((entry: LeaderboardEntry) => ({
            ...entry,
            isCurrentUser: entry.userId === user.id
          }));
          setGlobalLeaderboard(processedGlobalData);
          
          // Определяем ранг пользователя в глобальной таблице
          const userIndex = processedGlobalData.findIndex(
            entry => String(entry.userId) === String(user.id)
          );
          if (userIndex !== -1) {
            setUserRank(userIndex + 1);
          }
        }
        
        // Обрабатываем данные за неделю, помечая текущего пользователя
        if (user && weeklyData) {
          const processedWeeklyData = weeklyData.map((entry: LeaderboardEntry) => ({
            ...entry,
            isCurrentUser: String(entry.userId) === String(user.id)
          }));
          setWeeklyLeaderboard(processedWeeklyData);
        }
      } catch (err) {
        console.error('Ошибка загрузки таблицы лидеров:', err);
        setError('Не удалось загрузить таблицу лидеров. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, [user]);
  
  // Обработчик переключения вкладок с анимациями
  const handleTabChange = (tab: 'global' | 'weekly') => {
    if (tab === activeTab) return;
    
    // Применяем анимацию при смене вкладок
    if (leaderboardRef.current) {
      leaderboardRef.current.classList.add('fade-out');
      
      setTimeout(() => {
        setActiveTab(tab);
        
        setTimeout(() => {
          if (leaderboardRef.current) {
            leaderboardRef.current.classList.remove('fade-out');
            leaderboardRef.current.classList.add('fade-in');
            
            setTimeout(() => {
              if (leaderboardRef.current) {
                leaderboardRef.current.classList.remove('fade-in');
              }
            }, 300);
          }
        }, 10);
      }, 300);
    } else {
      setActiveTab(tab);
    }
    
    // Анимация для вкладки
    if (tabsRef.current) {
      const tabElements = tabsRef.current.querySelectorAll('.tab');
      tabElements.forEach(tabEl => {
        if (tabEl.textContent?.toLowerCase().includes(tab)) {
          tabEl.classList.add('active-tab-animation');
          setTimeout(() => {
            tabEl.classList.remove('active-tab-animation');
          }, 400);
        }
      });
    }
  };
  
  // Определение класса медали для рейтинга
  const getMedalClass = (rank: number) => {
    if (rank === 1) return 'gold-medal';
    if (rank === 2) return 'silver-medal';
    if (rank === 3) return 'bronze-medal';
    return '';
  };
  
  // Определение текущей таблицы на основе активной вкладки
  const currentLeaderboard = activeTab === 'global' ? globalLeaderboard : weeklyLeaderboard;
  
  return (
    <div className={`leaderboard-page ${theme}`}>
      <div className="leaderboard-header">
        <h1>Таблица лидеров</h1>
        <div ref={tabsRef} className="tabs">
          <button 
            className={`tab ${activeTab === 'global' ? 'active' : ''}`}
            onClick={() => handleTabChange('global')}
          >
            Все время
          </button>
          <button 
            className={`tab ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => handleTabChange('weekly')}
          >
            За неделю
          </button>
        </div>
      </div>
      
      {userRank !== null && (
        <div className="user-rank">
          <div className="user-rank-content">
            <div className="user-rank-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L4 8l1.5-1.5L12 13l6.5-6.5L20 8l-8 8z" fill="currentColor" />
              </svg>
            </div>
            <div className="user-rank-info">
              <div className="user-rank-title">Ваш текущий рейтинг</div>
              <div className="user-rank-position">
                <span className="rank-number">{userRank}</span>
                <span className="rank-suffix">место</span>
              </div>
            </div>
            <div className="user-rank-stats">
              {user && globalLeaderboard.find(entry => String(entry.userId) === String(user.id)) && (
                <>
                  <div className="rank-stat">
                    <span className="stat-value">
                      {globalLeaderboard.find(entry => String(entry.userId) === String(user.id))?.score || 0}
                    </span>
                    <span className="stat-label">Очки</span>
                  </div>
                  <div className="rank-stat">
                    <span className="stat-value">
                      {globalLeaderboard.find(entry => String(entry.userId) === String(user.id))?.completedQuests || 0}
                    </span>
                    <span className="stat-label">Квесты</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {userRank > 3 && userRank <= 10 && (
            <div className="user-rank-progress">
              <div className="progress-text">До топ-3 осталось: {userRank - 3} позиций</div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${((10 - userRank) / 7) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div ref={leaderboardRef} className="leaderboard-container">
        {isLoading ? (
          <div className="leaderboard-loading">
            <div className="leaderboard-spinner"></div>
            <p>Загрузка рейтинга...</p>
          </div>
        ) : error ? (
          <div className="leaderboard-error">
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Попробовать снова
            </button>
          </div>
        ) : currentLeaderboard.length === 0 ? (
          <div className="empty-leaderboard">
            <p>Нет данных для отображения</p>
          </div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Ранг</th>
                <th>Игрок</th>
                <th>Счет</th>
                <th>Квесты</th>
              </tr>
            </thead>
            <tbody>
              {currentLeaderboard.map((entry, index) => (
                <tr 
                  key={entry.userId} 
                  className={`${entry.isCurrentUser ? 'current-user-row' : ''} ${getMedalClass(index + 1)}`}
                >
                  <td className={`rank-column ${getMedalClass(index + 1)}`}>
                    {index + 1}
                  </td>
                  <td className="user-column">
                    <div className={`user-avatar ${getMedalClass(index + 1)}`}>
                      <span>{entry.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="username">{entry.username}</span>
                  </td>
                  <td className="score-column">{entry.score}</td>
                  <td className="quests-column">{entry.completedQuests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage; 