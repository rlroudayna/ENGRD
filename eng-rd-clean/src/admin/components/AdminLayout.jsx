// src/admin/components/AdminLayout.jsx
import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminStyles.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await logout();
      navigate('/admin/login');
    }
  };

  const isActive = (path) => {
    // For routes, check if the current path starts with the route path
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className="admin-layout-container">
      <nav className="admin-navbar">
        <div className="navbar-logo">
          ENG<span>RD</span> Admin
        </div>
        
        <div className="navbar-links">
          <Link to="/admin/jobs" className={isActive('/admin/jobs')}>
            Offres d'emploi
          </Link>
          <Link to="/admin/applications" className={isActive('/admin/applications')}>
            Candidatures
          </Link>
          <Link to="/admin/news" className={isActive('/admin/news')}>
            Actualités
          </Link>
          <Link to="/admin/messages" className={isActive('/admin/messages')}>
            Messages
          </Link>
          <Link to="/admin/home-content" className={isActive('/admin/home-content')}>
            Page d'accueil
          </Link>
        </div>

        <div className="navbar-user-section">
          <span className="user-welcome">
            Bonjour, {user?.username}
          </span>
          <button onClick={handleLogout} className="logout-button">
            Déconnexion
          </button>
        </div>
      </nav>
      
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}