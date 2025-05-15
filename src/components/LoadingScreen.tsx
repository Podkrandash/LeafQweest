import { useEffect, useState } from 'react';
import '../styles/LoadingScreen.css';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen = ({ isLoading }: LoadingScreenProps) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Задержка перед скрытием для плавной анимации
      const timer = setTimeout(() => {
        setHidden(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setHidden(false);
    }
  }, [isLoading]);

  if (hidden) return null;

  return (
    <div className={`loading-screen ${!isLoading ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="leaf-container">
          <svg className="leaf" viewBox="0 0 100 100" width="80" height="80">
            <path 
              d="M50,10 C70,20 90,40 50,90 C10,40 30,20 50,10 Z" 
              fill="currentColor"
            />
            <path 
              className="leaf-vein" 
              d="M50,10 C50,40 50,70 50,90" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            />
            <path 
              className="leaf-vein-side" 
              d="M30,30 C40,35 50,38 70,40" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            />
            <path 
              className="leaf-vein-side" 
              d="M30,50 C40,55 50,58 70,60" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div className="app-name">LeafQuest</div>
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 