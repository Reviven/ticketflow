import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../services';
import type { Ticket, Page as PageType, TicketStatus } from '../types';

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

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const params: Record<string, string | number> = { page, size: 20, sort: 'createdAt,desc' };
    if (filter === 'unassigned') params.filter = 'unassigned';
    else if (filter === 'overdue') params.filter = 'overdue';
    else if (filter !== 'all') params.status = filter;

    ticketService.getAll(params).then(r => {
      setTickets(r.data.content);
      setTotalPages(r.data.totalPages);
      setTotalElements(r.data.totalElements);
    }).catch(() => {});
  }, [page, filter]);

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <h2>Zgłoszenia</h2>
          <p>Zarządzaj wszystkimi zgłoszeniami w systemie</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/tickets/new')}>
          <i className="fas fa-plus"></i> Nowe zgłoszenie
        </button>
      </div>

      <div className="toolbar">
        {[
          { key: 'all', label: `Wszystkie (${totalElements})` },
          { key: 'NEW', label: 'Nowe' },
          { key: 'OPEN', label: 'Otwarte' },
          { key: 'IN_PROGRESS', label: 'W trakcie' },
          { key: 'unassigned', label: 'Nieprzypisane' },
          { key: 'overdue', label: 'Przeterminowane' },
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
              <th style={{ width: 40 }}><input type="checkbox" /></th>
              <th>Numer</th>
              <th>Tytuł</th>
              <th>Priorytet</th>
              <th>Status</th>
              <th>Zgłaszający</th>
              <th>Przypisany</th>
              <th>Kategoria</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id} onClick={() => navigate(`/tickets/${ticket.id}`)} style={{ cursor: 'pointer' }}>
                <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                <td style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 12 }}>#{ticket.ticketNumber}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{ticket.title}</div>
                  {ticket.tags && ticket.tags.length > 0 && (
                    <div style={{ marginTop: 4 }}>
                      {ticket.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  )}
                </td>
                <td><span className={`status ${priorityMap[ticket.priority]?.cls}`}>{priorityMap[ticket.priority]?.label}</span></td>
                <td><span className={`status ${statusMap[ticket.status]?.cls}`}><span className="status-dot"></span> {statusMap[ticket.status]?.label}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{ticket.requester?.initials}</div>
                    <span style={{ fontSize: 12.5 }}>{ticket.requester?.fullName}</span>
                  </div>
                </td>
                <td>
                  {ticket.assignee ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 10, background: 'var(--success)' }}>{ticket.assignee.initials}</div>
                      <span style={{ fontSize: 12.5 }}>{ticket.assignee.fullName}</span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--gray-400)', fontSize: 12 }}>Nieprzypisany</span>
                  )}
                </td>
                <td style={{ fontSize: 12.5, color: 'var(--gray-500)' }}>{ticket.categoryName || '—'}</td>
                <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{new Date(ticket.createdAt).toLocaleDateString('pl-PL')}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 40 }}>Brak zgłoszeń spełniających kryteria</td></tr>
            )}
          </tbody>
        </table>
        {totalPages > 0 && (
          <div className="pagination">
            <span className="pagination-info">
              Wyświetlanie {page * 20 + 1}-{Math.min((page + 1) * 20, totalElements)} z {totalElements} zgłoszeń
            </span>
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
