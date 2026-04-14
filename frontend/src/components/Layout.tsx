import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div>
            <h1>TicketFlow</h1>
            <span>Zarządzanie zgłoszeniami</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">Menu główne</div>
          <NavLink to="/" className="nav-item" end onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </NavLink>
          <NavLink to="/tickets" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-ticket-alt"></i> Zgłoszenia
            <span className="nav-badge">24</span>
          </NavLink>
          <NavLink to="/tickets/new" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-plus-circle"></i> Nowe zgłoszenie
          </NavLink>

          <div className="nav-section">Zarządzanie</div>
          <NavLink to="/knowledge" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-book"></i> Baza wiedzy
          </NavLink>
          <NavLink to="/projects" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-project-diagram"></i> Projekty
          </NavLink>
          <NavLink to="/cmdb" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-server"></i> Zasoby / CMDB
          </NavLink>

          <div className="nav-section">Raporty</div>
          <NavLink to="/stats" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-chart-bar"></i> Statystyki
          </NavLink>
          <NavLink to="/sla-reports" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-chart-line"></i> Raporty SLA
          </NavLink>

          <div className="nav-section">System</div>
          <NavLink to="/settings" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-cog"></i> Ustawienia
          </NavLink>
          <NavLink to="/users" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-users-cog"></i> Użytkownicy / LDAP
          </NavLink>
        </nav>

        <div className="sidebar-user">
          <div className="avatar">{user?.initials || 'DK'}</div>
          <div className="user-info">
            <div className="user-name">{user?.fullName || 'Damian Kowalski'}</div>
            <div className="user-role">{user?.role === 'ADMIN' ? 'Administrator' : user?.role || 'Administrator'}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Wyloguj">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="header">
          <button className="header-btn menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="header-search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Szukaj zgłoszeń, użytkowników, artykułów..." />
          </div>
          <div className="header-actions">
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/tickets/new')}>
              <i className="fas fa-plus"></i> Nowe zgłoszenie
            </button>
            <button className="header-btn">
              <i className="far fa-bell"></i>
              <span className="notif-dot"></span>
            </button>
            <button className="header-btn">
              <i className="far fa-question-circle"></i>
            </button>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
