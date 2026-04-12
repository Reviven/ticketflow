import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService, categoryService } from '../services';
import type { Category } from '../types';

export default function NewTicketPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: '', description: '', type: 'INCIDENT', priority: 'MEDIUM',
    categoryId: '', assigneeId: '', location: '', cmdbAsset: '', tags: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoryService.getAll(true).then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: Record<string, unknown> = {
        title: form.title,
        description: form.description,
        type: form.type,
        priority: form.priority,
        location: form.location || undefined,
        cmdbAsset: form.cmdbAsset || undefined,
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        assigneeId: form.assigneeId ? Number(form.assigneeId) : undefined,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      };
      const res = await ticketService.create(data);
      navigate(`/tickets/${res.data.id}`);
    } catch {
      alert('Błąd podczas tworzenia zgłoszenia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <h2>Nowe zgłoszenie</h2>
          <p>Utwórz nowe zgłoszenie w systemie</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 24 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full">
                <label>Tytuł <span className="required">*</span></label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Wprowadź krótki opis problemu..." required />
              </div>

              <div className="form-group">
                <label>Typ zgłoszenia <span className="required">*</span></label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="INCIDENT">Incydent</option>
                  <option value="PROBLEM">Problem</option>
                  <option value="REQUEST">Zapytanie</option>
                  <option value="CHANGE">Zmiana</option>
                </select>
              </div>

              <div className="form-group">
                <label>Kategoria</label>
                <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">Wybierz kategorię...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.fullPath}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Priorytet</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="LOW">Niski</option>
                  <option value="MEDIUM">Średni</option>
                  <option value="HIGH">Wysoki</option>
                  <option value="CRITICAL">Krytyczny</option>
                </select>
              </div>

              <div className="form-group">
                <label>Lokalizacja</label>
                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="np. Budynek A, piętro 3" />
              </div>

              <div className="form-group full">
                <label>Opis</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Szczegółowy opis problemu..." rows={6} />
              </div>

              <div className="form-group">
                <label>Powiązany zasób (CMDB)</label>
                <input type="text" value={form.cmdbAsset} onChange={e => setForm({ ...form, cmdbAsset: e.target.value })}
                  placeholder="np. HP LaserJet Pro M404dn" />
              </div>

              <div className="form-group">
                <label>Tagi (rozdziel przecinkami)</label>
                <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="np. pilne, drukarka, 3-piętro" />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/tickets')}>Anuluj</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Tworzenie...</> : <><i className="fas fa-plus"></i> Utwórz zgłoszenie</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
