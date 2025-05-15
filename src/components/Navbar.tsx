import { Link, useLocation } from 'react-router-dom';
import { useTelegram } from '../contexts/TelegramContext';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <Link 
        to="/" 
        className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}
      >
        <div className="navbar-icon">
          <svg viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <div className="navbar-label">Карта</div>
      </Link>
      
      <Link 
        to="/leaderboard" 
        className={`navbar-item ${location.pathname === '/leaderboard' ? 'active' : ''}`}
      >
        <div className="navbar-icon">
          <svg viewBox="0 0 24 24">
            <path d="M18 20V10"></path>
            <path d="M12 20V4"></path>
            <path d="M6 20v-6"></path>
          </svg>
        </div>
        <div className="navbar-label">Лидеры</div>
      </Link>
      
      <Link 
        to="/profile" 
        className={`navbar-item ${location.pathname === '/profile' ? 'active' : ''}`}
      >
        <div className="navbar-icon">
          <svg viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div className="navbar-label">Профиль</div>
      </Link>
    </nav>
  );
};

export default Navbar; 