import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch {
      setError('Nieprawidłowa nazwa użytkownika lub hasło');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, background: 'var(--primary)', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', marginBottom: 12 }}>
            <i className="fas fa-ticket-alt"></i>
          </div>
        </div>
        <h2>TicketFlow</h2>
        <p>Zaloguj się do systemu zarządzania zgłoszeniami</p>

        {error && <div className="error-msg"><i className="fas fa-exclamation-circle"></i> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nazwa użytkownika</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Wprowadź login..." required />
          </div>
          <div className="form-group">
            <label>Hasło</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Wprowadź hasło..." required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Logowanie...</> : <><i className="fas fa-sign-in-alt"></i> Zaloguj się</>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--gray-400)' }}>
          Domyślne konto: admin / admin123
        </div>
      </div>
    </div>
  );
}
