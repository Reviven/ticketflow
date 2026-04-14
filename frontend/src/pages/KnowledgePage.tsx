import React, { useEffect, useState } from 'react';
import { knowledgeService } from '../services';
import type { KnowledgeCategory, KnowledgeArticle, Page as PageType } from '../types';

const defaultIcons: Record<string, string> = {
  'Sprzęt': 'fa-desktop',
  'Oprogramowanie': 'fa-cube',
  'Sieć': 'fa-network-wired',
  'Bezpieczeństwo IT': 'fa-shield-alt',
  'Konta i uprawnienia': 'fa-key',
  'Onboarding / Offboarding': 'fa-user-check',
};

const defaultColors: Record<string, string> = {
  'Sprzęt': '#3b82f6',
  'Oprogramowanie': '#8b5cf6',
  'Sieć': '#10b981',
  'Bezpieczeństwo IT': '#ef4444',
  'Konta i uprawnienia': '#f59e0b',
  'Onboarding / Offboarding': '#06b6d4',
};

export default function KnowledgePage() {
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);

  useEffect(() => {
    knowledgeService.getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedCategory !== null) {
      knowledgeService.getArticles({ categoryId: selectedCategory, size: 50 })
        .then(r => setArticles(r.data.content)).catch(() => {});
    }
  }, [selectedCategory]);

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <h2>Baza wiedzy</h2>
          <p>Artykuły i poradniki dla zespołu IT</p>
        </div>
        <button className="btn btn-primary">
          <i className="fas fa-plus"></i> Nowy artykuł
        </button>
      </div>

      {selectedCategory === null ? (
        <div className="kb-grid">
          {categories.map(cat => {
            const icon = cat.icon || defaultIcons[cat.name] || 'fa-folder';
            const color = cat.color || defaultColors[cat.name] || '#6b7280';
            return (
              <div key={cat.id} className="kb-card" onClick={() => setSelectedCategory(cat.id)}>
                <div className="kb-icon" style={{ background: color + '20', color }}>
                  <i className={`fas ${icon}`}></i>
                </div>
                <h4>{cat.name}</h4>
                <p>{cat.description || 'Artykuły w tej kategorii'}</p>
                <div className="kb-count">{cat.articleCount} artykułów</div>
              </div>
            );
          })}
          {categories.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--gray-400)' }}>
              Brak kategorii w bazie wiedzy
            </div>
          )}
        </div>
      ) : (
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedCategory(null); setArticles([]); }}
            style={{ marginBottom: 16 }}>
            <i className="fas fa-arrow-left"></i> Powrót do kategorii
          </button>

          <div className="card">
            <div className="card-header">
              <h3>{categories.find(c => c.id === selectedCategory)?.name} — artykuły</h3>
            </div>
            {articles.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Tytuł</th>
                    <th>Autor</th>
                    <th>Wyświetlenia</th>
                    <th>Aktualizacja</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(article => (
                    <tr key={article.id} style={{ cursor: 'pointer' }}>
                      <td style={{ fontWeight: 500 }}>{article.title}</td>
                      <td style={{ fontSize: 12.5 }}>{article.author?.fullName || '—'}</td>
                      <td style={{ fontSize: 12.5, color: 'var(--gray-500)' }}>
                        <i className="far fa-eye" style={{ marginRight: 4 }}></i>{article.viewCount}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{new Date(article.updatedAt).toLocaleDateString('pl-PL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)' }}>
                Brak artykułów w tej kategorii
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
