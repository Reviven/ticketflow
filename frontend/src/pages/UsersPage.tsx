import React, { useEffect, useState } from 'react';
import { userService } from '../services';
import type { User, Page as PageType } from '../types';

const roleMap: Record<string, string> = {
  ADMIN: 'Administrator',
  TECHNICIAN: 'Technik',
  USER: 'Użytkownik',
  OBSERVER: 'Obserwator',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    userService.getStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const params: Record<string, string | number> = { page, size: 20 };
    if (filter === 'ldap-disabled') params.filter = 'ldap-disabled';
    else if (filter === 'LDAP') params.source = 'LDAP';
    else if (filter === 'LOCAL') params.source = 'LOCAL';
    else if (filter === 'ACTIVE') params.status = 'ACTIVE';

    userService.getAll(params).then(r => {
      setUsers(r.data.content);
      setTotalPages(r.data.totalPages);
      setTotalElements(r.data.totalElements);
    }).catch(() => {});
  }, [page, filter]);

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <h2>Użytkownicy / Active Directory</h2>
          <p>Zarządzanie użytkownikami i synchronizacja z LDAP</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary"><i className="fas fa-sync-alt"></i> Synchronizuj LDAP</button>
          <button className="btn btn-primary"><i className="fas fa-user-plus"></i> Dodaj użytkownika</button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon green"><i className="fas fa-plug"></i></div>
          </div>
          <div className="stat-value" style={{ fontSize: 20 }}>Połączono</div>
          <div className="stat-label">Status LDAP</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon blue"><i className="fas fa-users"></i></div>
          </div>
          <div className="stat-value">{stats.total ?? 0}</div>
          <div className="stat-label">Wszyscy użytkownicy</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon yellow"><i className="fas fa-sitemap"></i></div>
          </div>
          <div className="stat-value">{stats.ldap ?? 0}</div>
          <div className="stat-label">Użytkownicy LDAP</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon red"><i className="fas fa-user-slash"></i></div>
          </div>
          <div className="stat-value">{stats.disabled ?? 0}</div>
          <div className="stat-label">Wyłączeni w AD</div>
        </div>
      </div>

      <div className="toolbar">
        {[
          { key: 'all', label: 'Wszyscy' },
          { key: 'ACTIVE', label: 'Aktywni' },
          { key: 'LDAP', label: 'LDAP/AD' },
          { key: 'LOCAL', label: 'Lokalni' },
          { key: 'ldap-disabled', label: 'Wyłączeni w AD' },
        ].map(f => (
          <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => { setFilter(f.key); setPage(0); }}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Użytkownik</th>
              <th>Email</th>
              <th>Dział</th>
              <th>Rola</th>
              <th>Źródło</th>
              <th>Status</th>
              <th>Grupy AD</th>
              <th>Ostatnie logowanie</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar" style={{ width: 32, height: 32, fontSize: 11,
                      background: user.source === 'LDAP' ? 'var(--info)' : 'var(--primary)' }}>
                      {user.initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{user.fullName}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 12.5 }}>{user.email}</td>
                <td style={{ fontSize: 12.5, color: 'var(--gray-500)' }}>{user.department || '—'}</td>
                <td><span className="tag">{roleMap[user.role] || user.role}</span></td>
                <td>
                  <span className={`status ${user.source === 'LDAP' ? 'status-new' : 'status-progress'}`}>
                    <i className={`fas ${user.source === 'LDAP' ? 'fa-sitemap' : 'fa-user'}`} style={{ fontSize: 10, marginRight: 4 }}></i>
                    {user.source === 'LDAP' ? 'Active Directory' : 'Lokalny'}
                  </span>
                </td>
                <td>
                  <span className={`status ${user.status === 'ACTIVE' ? 'status-resolved' : 'status-closed'}`}>
                    <span className="status-dot"></span>
                    {user.status === 'ACTIVE' ? 'Aktywny' : user.status === 'DISABLED' ? 'Wyłączony' : 'Zablokowany'}
                  </span>
                </td>
                <td>
                  {user.ldapGroups && user.ldapGroups.length > 0 ? (
                    <div>{user.ldapGroups.map(g => <span key={g} className="tag">{g}</span>)}</div>
                  ) : <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>—</span>}
                </td>
                <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString('pl-PL') : '—'}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 40 }}>Brak użytkowników</td></tr>
            )}
          </tbody>
        </table>
        {totalPages > 0 && (
          <div className="pagination">
            <span className="pagination-info">{totalElements} użytkowników</span>
            <div className="pagination-btns">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
                <i className="fas fa-chevron-left"></i>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button key={i} className={page === i ? 'active' : ''} onClick={() => setPage(i)}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
