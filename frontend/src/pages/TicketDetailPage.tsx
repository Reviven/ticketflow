import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../services';
import type { Ticket, Comment } from '../types';

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

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (id) {
      ticketService.getById(Number(id)).then(r => setTicket(r.data)).catch(() => navigate('/tickets'));
    }
  }, [id, navigate]);

  const handleAddComment = async () => {
    if (!commentText.trim() || !id) return;
    await ticketService.addComment(Number(id), commentText);
    setCommentText('');
    ticketService.getById(Number(id)).then(r => setTicket(r.data));
  };

  const handleStatusChange = async (status: string) => {
    if (!id) return;
    await ticketService.update(Number(id), { status });
    ticketService.getById(Number(id)).then(r => setTicket(r.data));
  };

  if (!ticket) return <div className="content"><p>Ładowanie...</p></div>;

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/tickets')}>
              <i className="fas fa-arrow-left"></i> Powrót
            </button>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>#{ticket.ticketNumber}</span>
          </div>
          <h2>{ticket.title}</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Main content */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><h3>Opis</h3></div>
            <div className="card-body">
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.7 }}>{ticket.description || 'Brak opisu'}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Komentarze ({ticket.comments?.length || 0})</h3>
            </div>
            <div className="card-body">
              {ticket.comments?.map(comment => (
                <div key={comment.id} style={{ display: 'flex', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--gray-100)' }}>
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: 11, flexShrink: 0 }}>{comment.author?.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: 13 }}>{comment.author?.fullName}</strong>
                      <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{new Date(comment.createdAt).toLocaleString('pl-PL')}</span>
                      {comment.internal && <span className="tag" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>Wewnętrzny</span>}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6 }}>{comment.content}</p>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 16 }}>
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Dodaj komentarz..."
                  style={{ width: '100%', padding: 12, border: '1px solid var(--gray-200)', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, minHeight: 80, resize: 'vertical', outline: 'none' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <button className="btn btn-primary btn-sm" onClick={handleAddComment}>
                    <i className="fas fa-paper-plane"></i> Wyślij
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card">
            <div style={{ padding: 16, borderBottom: '1px solid var(--gray-100)' }}>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--gray-500)', display: 'block', marginBottom: 6 }}>Status</label>
              <select value={ticket.status} onChange={e => handleStatusChange(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--gray-200)', borderRadius: 6, fontSize: 13, fontFamily: 'inherit' }}>
                <option value="NEW">Nowy</option>
                <option value="OPEN">Otwarty</option>
                <option value="IN_PROGRESS">W trakcie</option>
                <option value="RESOLVED">Rozwiązany</option>
                <option value="CLOSED">Zamknięty</option>
              </select>
            </div>
            <div style={{ padding: 16, borderBottom: '1px solid var(--gray-100)' }}>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--gray-500)', display: 'block', marginBottom: 6 }}>Priorytet</label>
              <span className={`status ${priorityMap[ticket.priority]?.cls}`}>{priorityMap[ticket.priority]?.label}</span>
            </div>
            <div style={{ padding: 16, borderBottom: '1px solid var(--gray-100)' }}>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--gray-500)', display: 'block', marginBottom: 6 }}>Kategoria</label>
              <span style={{ fontSize: 13 }}>{ticket.categoryName || 'Brak'}</span>
            </div>
            <div style={{ padding: 16, borderBottom: '1px solid var(--gray-100)' }}>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--gray-500)', display: 'block', marginBottom: 6 }}>Przypisany do</label>
              {ticket.assignee ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{ticket.assignee.initials}</div>
                  <span style={{ fontSize: 13 }}>{ticket.assignee.fullName}</span>
                </div>
              ) : <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>Nieprzypisany</span>}
            </div>
            <div style={{ padding: 16, borderBottom: '1px solid var(--gray-100)' }}>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--gray-500)', display: 'block', marginBottom: 6 }}>Zgłaszający</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{ticket.requester?.initials}</div>
                <span style={{ fontSize: 13 }}>{ticket.requester?.fullName}</span>
              </div>
            </div>
            {ticket.tags && ticket.tags.length > 0 && (
              <div style={{ padding: 16, borderBottom: '1px solid var(--gray-100)' }}>
                <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--gray-500)', display: 'block', marginBottom: 6 }}>Tagi</label>
                <div>{ticket.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            )}
            <div style={{ padding: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--gray-500)', display: 'block', marginBottom: 6 }}>Utworzono</label>
              <span style={{ fontSize: 13 }}>{new Date(ticket.createdAt).toLocaleString('pl-PL')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
