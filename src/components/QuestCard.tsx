import { useState } from 'react';
import type { Quest, Position } from '../types';
import { questApi } from '../api/api';

interface QuestCardProps {
  quest: Quest;
  userPosition: Position | null;
  onClose: () => void;
  onCompleted: () => void;
}

const QuestCard = ({ quest, userPosition, onClose, onCompleted }: QuestCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Проверяем, находится ли пользователь достаточно близко к квесту
  const isNearQuest = (): boolean => {
    if (!userPosition) return false;

    // Функция для расчета расстояния между двумя координатами (в метрах)
    const getDistanceFromLatLonInM = (
      lat1: number, 
      lon1: number, 
      lat2: number, 
      lon2: number
    ): number => {
      const R = 6371; // Радиус Земли в км
      const dLat = deg2rad(lat2-lat1);
      const dLon = deg2rad(lon2-lon1); 
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c * 1000; // Расстояние в метрах
      return d;
    };
    
    const deg2rad = (deg: number): number => {
      return deg * (Math.PI/180);
    };

    const distance = getDistanceFromLatLonInM(
      userPosition.latitude,
      userPosition.longitude,
      quest.latitude,
      quest.longitude
    );

    // Считаем, что пользователь "рядом", если расстояние меньше 50 метров
    return distance < 50;
  };

  // Определяем сложность квеста на основе награды
  const getDifficulty = (): string => {
    if (quest.reward < 70) return 'easy';
    if (quest.reward < 120) return 'medium';
    return 'hard';
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteQuest = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Проверяем, что для квеста типа PHOTO или BOTH есть фото
      if ((quest.type === 'PHOTO' || quest.type === 'BOTH') && !selectedImage) {
        setError('Необходимо загрузить фото для выполнения этого квеста');
        return;
      }

      // Проверяем, что для квеста типа GPS или BOTH пользователь рядом
      if ((quest.type === 'GPS' || quest.type === 'BOTH') && !isNearQuest()) {
        setError('Вы должны находиться рядом с местом квеста');
        return;
      }

      // Отправляем запрос в зависимости от типа квеста
      let result;
      
      if (quest.type === 'PHOTO' && selectedImage) {
        // Для фото квестов
        result = await questApi.verifyPhotoQuest(quest.id, selectedImage);
      } else {
        // Для GPS квестов
        result = await questApi.completeQuest(quest.id);
      }
      
      if (result.success) {
        onCompleted();
      } else {
        setError('Не удалось выполнить квест');
      }
    } catch (err) {
      setError('Произошла ошибка при выполнении квеста');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Рассчитываем расстояние до квеста
  const getDistance = (): string | null => {
    if (!userPosition) return null;
    
    const getDistanceFromLatLonInM = (
      lat1: number, 
      lon1: number, 
      lat2: number, 
      lon2: number
    ): number => {
      const R = 6371; // Радиус Земли в км
      const dLat = deg2rad(lat2-lat1);
      const dLon = deg2rad(lon2-lon1); 
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c * 1000; // Расстояние в метрах
      return d;
    };
    
    const deg2rad = (deg: number): number => {
      return deg * (Math.PI/180);
    };

    const distance = getDistanceFromLatLonInM(
      userPosition.latitude,
      userPosition.longitude,
      quest.latitude,
      quest.longitude
    );
    
    if (distance < 1000) {
      return `${Math.round(distance)} м`;
    } else {
      return `${(distance / 1000).toFixed(1)} км`;
    }
  };

  return (
    <div className="quest-card">
      <button className="close-button" onClick={onClose}>×</button>
      
      <div className="quest-card-image">
        <img src={`https://source.unsplash.com/random/400x200/?${encodeURIComponent(quest.title)}`} alt={quest.title} />
        <div className="quest-card-overlay"></div>
        <div className={`quest-card-difficulty difficulty-${getDifficulty()}`}>
          {getDifficulty() === 'easy' ? 'Легкий' : getDifficulty() === 'medium' ? 'Средний' : 'Сложный'}
        </div>
        <div className="quest-card-type">
          {quest.type === 'GPS' ? 'Локация' : quest.type === 'PHOTO' ? 'Фото' : 'Фото + Локация'}
        </div>
      </div>
      
      <div className="quest-card-content">
        <h3 className="quest-card-title">{quest.title}</h3>
        <p className="quest-card-description">{quest.description}</p>
        
        <div className="quest-card-footer">
          <div className="quest-card-rewards">
            <div className="xp-reward">XP: {quest.reward}</div>
          </div>
          
          {getDistance() && (
            <div className="quest-card-distance">
              {getDistance()}
            </div>
          )}
        </div>

        {(quest.type === 'PHOTO' || quest.type === 'BOTH') && (
          <div className="photo-upload">
            <label htmlFor="photo-input">
              {imagePreview ? (
                <img src={imagePreview} alt="Фото для квеста" className="image-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span>Нажмите, чтобы загрузить фото</span>
                </div>
              )}
            </label>
            <input
              type="file"
              id="photo-input"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <button 
          className="complete-button"
          onClick={handleCompleteQuest}
          disabled={isLoading}
        >
          {isLoading ? 'Выполняется...' : 'Выполнить квест'}
        </button>
      </div>
    </div>
  );
};

export default QuestCard; 