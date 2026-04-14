import api from './api';
import type { AuthResponse, DashboardStats, Ticket, User, Category, Tag, KnowledgeCategory, KnowledgeArticle, LdapConfig, LdapGroupMapping, Page } from '../types';

export const authService = {
  login: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { username, password }),
  me: () => api.get<User>('/auth/me'),
};

export const dashboardService = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
};

export const ticketService = {
  getAll: (params?: Record<string, string | number>) =>
    api.get<Page<Ticket>>('/tickets', { params }),
  getById: (id: number) => api.get<Ticket>(`/tickets/${id}`),
  getByNumber: (num: string) => api.get<Ticket>(`/tickets/number/${num}`),
  create: (data: Record<string, unknown>) => api.post<Ticket>('/tickets', data),
  update: (id: number, data: Record<string, unknown>) => api.put<Ticket>(`/tickets/${id}`, data),
  addComment: (id: number, content: string, internal: boolean = false) =>
    api.post(`/tickets/${id}/comments`, { content, internal }),
  getComments: (id: number) => api.get(`/tickets/${id}/comments`),
};

export const userService = {
  getAll: (params?: Record<string, string | number>) =>
    api.get<Page<User>>('/users', { params }),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  update: (id: number, data: Partial<User>) => api.put<User>(`/users/${id}`, data),
  getStats: () => api.get<Record<string, number>>('/users/stats'),
};

export const categoryService = {
  getAll: (flat: boolean = false) =>
    api.get<Category[]>('/categories', { params: { flat } }),
  getById: (id: number) => api.get<Category>(`/categories/${id}`),
  create: (data: Partial<Category>) => api.post<Category>('/categories', data),
};

export const tagService = {
  getAll: () => api.get<Tag[]>('/tags'),
  create: (data: Partial<Tag>) => api.post<Tag>('/tags', data),
};

export const ldapService = {
  getConfig: () => api.get<LdapConfig>('/ldap/config'),
  saveConfig: (data: LdapConfig) => api.put<LdapConfig>('/ldap/config', data),
  testConnection: () => api.post<{ connected: boolean; message: string }>('/ldap/test-connection'),
  getGroupMappings: () => api.get<LdapGroupMapping[]>('/ldap/group-mappings'),
  createGroupMapping: (data: LdapGroupMapping) => api.post<LdapGroupMapping>('/ldap/group-mappings', data),
  deleteGroupMapping: (id: number) => api.delete(`/ldap/group-mappings/${id}`),
};

export const knowledgeService = {
  getCategories: () => api.get<KnowledgeCategory[]>('/knowledge/categories'),
  getArticles: (params?: Record<string, string | number>) =>
    api.get<Page<KnowledgeArticle>>('/knowledge/articles', { params }),
  getArticle: (id: number) => api.get<KnowledgeArticle>(`/knowledge/articles/${id}`),
  createArticle: (data: Partial<KnowledgeArticle>) =>
    api.post<KnowledgeArticle>('/knowledge/articles', data),
};
