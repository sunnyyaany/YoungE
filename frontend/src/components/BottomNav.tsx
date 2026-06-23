import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, CalendarHeart, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();

  // Do not show bottom nav on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <Home size={24} />
        <span>홈</span>
      </Link>
      <Link to="/match" className={`nav-item ${location.pathname === '/match' ? 'active' : ''}`}>
        <Users size={24} />
        <span>매칭</span>
      </Link>
      <Link to="/eros" className={`nav-item ${location.pathname === '/eros' ? 'active' : ''}`}>
        <CalendarHeart size={24} />
        <span>에로스</span>
      </Link>
      <Link to="/login" className="nav-item">
        <User size={24} />
        <span>마이</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
