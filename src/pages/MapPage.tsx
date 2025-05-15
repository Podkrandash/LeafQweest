import { useEffect, useState } from 'react';
import Map from '../components/Map';
import QuestCard from '../components/QuestCard';
import { questApi } from '../api/api';
import type { Quest, Position } from '../types';
import { useTelegram } from '../contexts/TelegramContext';

// Кэш для хранения данных квестов
let questsCache: Quest[] = [];

const MapPage = () => {
  const [quests, setQuests] = useState<Quest[]>(questsCache);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isLoading, setIsLoading] = useState(questsCache.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const { theme } = useTelegram();
  
  useEffect(() => {
    const loadQuests = async () => {
      // Если есть кэшированные данные, не показываем загрузчик
      if (questsCache.length > 0) {
        setQuests(questsCache);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const questsData = await questApi.getQuests();
        setQuests(questsData);
        // Обновляем кэш
        questsCache = questsData;
      } catch (err) {
        setError('Не удалось загрузить квесты');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuests();
  }, []);
  
  // Получаем геолокацию пользователя
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          setUserPosition({
            latitude: geoPosition.coords.latitude,
            longitude: geoPosition.coords.longitude
          });
        },
        (error) => {
          console.error('Ошибка получения геолокации:', error);
        }
      );
    }
  }, []);
  
  const handleQuestClick = (quest: Quest) => {
    setSelectedQuest(quest);
  };
  
  const handleQuestClose = () => {
    setSelectedQuest(null);
  };
  
  const handleQuestCompleted = async () => {
    try {
      setIsLoading(true);
      
      // Обновляем список квестов
      const questsData = await questApi.getQuests();
      setQuests(questsData);
      // Обновляем кэш
      questsCache = questsData;
      
      // Закрываем карточку квеста
      setSelectedQuest(null);
      
      // Показываем уведомление
      alert('Квест успешно выполнен!');
    } catch (err) {
      setError('Не удалось обновить список квестов');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`map-page ${theme}`}>
      {isLoading && !quests.length ? (
        <div className="map-loading-overlay">
          <div className="map-loading-spinner">
            <div className="spinner-leaf"></div>
          </div>
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <Map
            quests={quests}
            onQuestSelect={handleQuestClick}
            userPosition={userPosition}
            completedQuestIds={[]}
          />
          
          {selectedQuest && (
            <div className="quest-card-overlay">
              <QuestCard
                quest={selectedQuest}
                userPosition={userPosition}
                onClose={handleQuestClose}
                onCompleted={handleQuestCompleted}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapPage; 