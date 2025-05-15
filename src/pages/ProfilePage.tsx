import { useState, useEffect } from 'react';
import { useTelegram } from '../contexts/TelegramContext';
import { userApi } from '../api/api';
import type { AppSettings } from '../types';

// Кэширование данных настроек
let settingsCache: AppSettings | null = null;

interface ProfileStats {
  level: number;
  nextLevelXp: number;
  currentXp: number;
  achievements: number;
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
  
  return { level, nextLevelXp, currentXp, achievements };
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
  const [activeTab, setActiveTab] = useState<'settings' | 'achievements'>('settings');

  // При первой загрузке сохраняем данные в кэш
  useEffect(() => {
    if (settings && !settingsCache) {
      settingsCache = settings;
    }
  }, [settings]);
  
  // Расчет статистики пользователя
  useEffect(() => {
    if (user) {
      setStats(calculateUserStats(user.completedQuests));
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
      
      await userApi.updateSettings(settings);
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
      
      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Настройки
        </button>
        <button 
          className={`profile-tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Достижения
        </button>
      </div>
      
      {activeTab === 'settings' && (
        <div className="profile-settings">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="theme">Тема оформления</label>
              <select
                id="theme"
                name="theme"
                value={settings.theme}
                onChange={handleSettingsChange}
                className="form-control"
              >
                <option value="light">Светлая</option>
                <option value="dark">Тёмная</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="language">Язык</label>
              <select
                id="language"
                name="language"
                value={settings.language}
                onChange={handleSettingsChange}
                className="form-control"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
            
            <div className="form-group checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleSettingsChange}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Уведомления</span>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="save-button"
              disabled={isLoading}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить настройки'}
            </button>
          </form>
        </div>
      )}
      
      {activeTab === 'achievements' && (
        <div className="profile-achievements">
          <div className="achievements-empty">
            <div className="achievements-icon"></div>
            <p>Достижения будут доступны в ближайшее время</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 