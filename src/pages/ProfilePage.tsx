import { useState, useEffect } from 'react';
import { useTelegram } from '../contexts/TelegramContext';
import { leaderboardApi } from '../api/api';
import type { AppSettings, LeaderboardEntry } from '../types';

// Кэширование данных настроек
let settingsCache: AppSettings | null = null;

interface ProfileStats {
  level: number;
  nextLevelXp: number;
  currentXp: number;
  achievements: number;
  rank: number | null;
}

const calculateUserStats = (completedQuests: number): ProfileStats => {
  // Расчет уровня и опыта на основе выполненных квестов
  const baseXpPerLevel = 100;
  const xpPerQuest = 75;
  const totalXp = completedQuests * xpPerQuest;
  
  // Формула для расчета уровня: уровень = 1 + sqrt(totalXp / baseXpPerLevel)
  const level = Math.floor(1 + Math.sqrt(totalXp / baseXpPerLevel));
  const currentLevelMinXp = baseXpPerLevel * (level - 1) * (level - 1);
  const nextLevelMinXp = baseXpPerLevel * level * level;
  const currentXp = totalXp - currentLevelMinXp;
  const nextLevelXp = nextLevelMinXp - currentLevelMinXp;
  
  // Оценка числа достижений на основе квестов
  const achievements = Math.floor(completedQuests / 3);
  
  return { level, nextLevelXp, currentXp, achievements, rank: null };
};

const ProfilePage = () => {
  const { user, theme } = useTelegram();
  const [settings, setSettings] = useState<AppSettings>(settingsCache || {
    theme: theme as 'light' | 'dark',
    language: 'ru',
    notifications: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'achievements' | 'settings'>('achievements');

  // При первой загрузке сохраняем данные в кэш
  useEffect(() => {
    if (settings && !settingsCache) {
      settingsCache = settings;
    }
  }, [settings]);
  
  // Загрузка данных таблицы лидеров для определения ранга пользователя
  useEffect(() => {
    if (user) {
      // Расчет статистики пользователя
      const calculatedStats = calculateUserStats(user.completedQuests);
      
      const fetchLeaderboardData = async () => {
        try {
          // Получаем данные для глобальной таблицы лидеров
          const globalData = await leaderboardApi.getLeaderboard('global');
          setLeaderboardEntries(globalData);
          
          // Определяем ранг пользователя в глобальной таблице
          if (user && globalData) {
            const userIndex = globalData.findIndex(
              entry => String(entry.userId) === String(user.id)
            );
            
            if (userIndex !== -1) {
              calculatedStats.rank = userIndex + 1;
            }
          }
          
          setStats(calculatedStats);
        } catch (err) {
          console.error('Ошибка загрузки данных:', err);
          // Если не удалось загрузить ранг, просто установим статистику без ранга
          setStats(calculatedStats);
        }
      };
      
      fetchLeaderboardData();
    }
  }, [user]);

  const handleSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    const newSettings = {
      ...settings,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value,
    };
    
    setSettings(newSettings);
    // Обновляем кэш
    settingsCache = newSettings;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // В реальном приложении здесь был бы API-запрос
      // await userApi.updateSettings(settings);
      setSuccess('Настройки успешно сохранены');
      
      // Обновляем кэш
      settingsCache = settings;
      
      // Показываем уведомление на короткое время
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Не удалось сохранить настройки');
      console.error(err);
      
      // Автоматически скрываем ошибку через 3 секунды
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner">
          <div className="spinner-leaf"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`profile-page ${theme}`}>
      <div className="profile-header">
        <div className="profile-header-backdrop"></div>
        <div className="profile-avatar-container">
          {user.photoUrl ? (
            <img 
              src={user.photoUrl} 
              alt={user.firstName} 
              className="profile-avatar" 
            />
          ) : (
            <div className="profile-avatar-placeholder">
              {user.firstName.charAt(0)}
            </div>
          )}
          {stats && (
            <div className="profile-level-badge">
              {stats.level}
            </div>
          )}
        </div>
        <h1>{user.firstName} {user.lastName}</h1>
        <p className="username">@{user.username}</p>
        
        {stats && stats.rank && (
          <div className="user-global-rank">
            <div className="rank-badge">{stats.rank}</div>
            <div className="rank-text">место в рейтинге</div>
          </div>
        )}
        
        {stats && (
          <div className="profile-level-progress">
            <div className="progress-text">
              <span>Уровень {stats.level}</span>
              <span>{stats.currentXp}/{stats.nextLevelXp} XP</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${(stats.currentXp / stats.nextLevelXp) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="stat-card-icon quests-icon"></div>
          <div className="stat-card-value">{user.completedQuests}</div>
          <div className="stat-card-label">Квестов выполнено</div>
        </div>
        
        {stats && (
          <>
            <div className="profile-stat-card">
              <div className="stat-card-icon level-icon"></div>
              <div className="stat-card-value">{stats.level}</div>
              <div className="stat-card-label">Уровень</div>
            </div>
            
            <div className="profile-stat-card">
              <div className="stat-card-icon achievements-icon"></div>
              <div className="stat-card-value">{stats.achievements}</div>
              <div className="stat-card-label">Достижения</div>
            </div>
          </>
        )}
      </div>
      
      {/* Сокращаем раздел настроек до минимума */}
      <div className="profile-settings">
        <div className="settings-section">
          <h2 className="section-title">Уведомления</h2>
          <div className="toggle-setting">
            <span>Получать уведомления о новых квестах</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => {
                  setSettings({...settings, notifications: e.target.checked});
                  settingsCache = {...settings, notifications: e.target.checked};
                }}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div className="settings-section">
          <h2 className="section-title">Язык</h2>
          <div className="language-selector">
            <button 
              className={`language-option ${settings.language === 'ru' ? 'active' : ''}`}
              onClick={() => {
                setSettings({...settings, language: 'ru'});
                settingsCache = {...settings, language: 'ru'};
              }}
            >
              Русский
            </button>
            <button 
              className={`language-option ${settings.language === 'en' ? 'active' : ''}`}
              onClick={() => {
                setSettings({...settings, language: 'en'});
                settingsCache = {...settings, language: 'en'};
              }}
            >
              English
            </button>
          </div>
        </div>
        
        <div className="user-version">
          <div className="version-label">Версия приложения</div>
          <div className="version-number">1.0.0</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 