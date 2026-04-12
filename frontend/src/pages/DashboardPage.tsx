import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService, ticketService } from '../services';
import type { DashboardStats, Ticket, Page } from '../types';

const statusMap: Record<string, { label: string; cls: string }> = {
  NEW: { label: 'Nowy', cls: 'status-new' },
  OPEN: { label: 'Otwarty', cls: 'status-open' },
  IN_PROGRESS: { label: 'W trakcie', cls: 'status-progress' },
  RESOLVED: { label: 'Rozwiązany', cls: 'status-resolved' },
  CLOSED: { label: 'Zamknięty', cls: 'status-closed' },
};

const priorityMap: Record<string, { label: string; cls: string }> = {
  CRITICAL: { label: 'Krytyczny', cls: 'priority-critical' },
  HIGH: { label: 'Wysoki', cls: 'priority-high' },
  MEDIUM: { label: 'Średni', cls: 'priority-medium' },
  LOW: { label: 'Niski', cls: 'priority-low' },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardService.getStats().then(r => setStats(r.data)).catch(() => {});
    ticketService.getAll({ size: 5, sort: 'createdAt,desc' }).then(r => setRecentTickets(r.data.content)).catch(() => {});
  }, []);

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Przegląd systemu zgłoszeń — dzisiaj, {new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><i className="fas fa-download"></i> Eksport</button>
          <button className="btn btn-secondary btn-sm"><i className="fas fa-filter"></i> Filtruj</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon blue"><i className="fas fa-ticket-alt"></i></div>
            <span className="stat-change up"><i className="fas fa-arrow-up"></i> 12%</span>
          </div>
          <div className="stat-value">{stats?.totalTickets ?? 0}</div>
          <div className="stat-label">Wszystkie zgłoszenia</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon yellow"><i className="fas fa-clock"></i></div>
            <span className="stat-change up"><i className="fas fa-arrow-up"></i> 5%</span>
          </div>
          <div className="stat-value">{stats?.pendingTickets ?? 0}</div>
          <div className="stat-label">Oczekujące</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon green"><i className="fas fa-check-circle"></i></div>
            <span className="stat-change up"><i className="fas fa-arrow-up"></i> 18%</span>
          </div>
          <div className="stat-value">{stats?.resolvedTickets ?? 0}</div>
          <div className="stat-label">Rozwiązane</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon red"><i className="fas fa-exclamation-triangle"></i></div>
            <span className="stat-change down"><i className="fas fa-arrow-down"></i> 3%</span>
          </div>
          <div className="stat-value">{stats?.criticalTickets ?? 0}</div>
          <div className="stat-label">Krytyczne</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <h3>Ostatnie zgłoszenia</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/tickets')}>Zobacz wszystkie</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Numer</th>
                  <th>Tytuł</th>
                  <th>Priorytet</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map(ticket => (
                  <tr key={ticket.id} onClick={() => navigate(`/tickets/${ticket.id}`)} style={{ cursor: 'pointer' }}>
                    <td style={{ color: 'var(--primary)', fontWeight: 500, fontSize: 12 }}>#{ticket.ticketNumber}</td>
                    <td>{ticket.title}</td>
                    <td><span className={`status ${priorityMap[ticket.priority]?.cls}`}>{priorityMap[ticket.priority]?.label}</span></td>
                    <td><span className={`status ${statusMap[ticket.status]?.cls}`}><span className="status-dot"></span> {statusMap[ticket.status]?.label}</span></td>
                  </tr>
                ))}
                {recentTickets.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 40 }}>Brak zgłoszeń</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-header"><h3>Szybkie statystyki</h3></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>Nowe dzisiaj</span>
                  <span style={{ fontWeight: 600 }}>{stats?.newToday ?? 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>Rozwiązane dzisiaj</span>
                  <span style={{ fontWeight: 600 }}>{stats?.resolvedToday ?? 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>Przeterminowane</span>
                  <span style={{ fontWeight: 600, color: 'var(--danger)' }}>{stats?.overdueTickets ?? 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>Użytkownicy LDAP</span>
                  <span style={{ fontWeight: 600 }}>{stats?.ldapUsers ?? 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>Wszyscy użytkownicy</span>
                  <span style={{ fontWeight: 600 }}>{stats?.totalUsers ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
