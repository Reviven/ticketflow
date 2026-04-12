export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  role: 'ADMIN' | 'TECHNICIAN' | 'USER' | 'OBSERVER';
  source: 'LOCAL' | 'LDAP';
  status: 'ACTIVE' | 'DISABLED' | 'LOCKED';
  ldapGroups?: string[];
  lastLogin?: string;
  createdAt: string;
  initials: string;
  fullName: string;
}

export interface UserSummary {
  id: number;
  username: string;
  fullName: string;
  initials: string;
  email: string;
  department?: string;
}

export interface Ticket {
  id: number;
  ticketNumber: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  categoryId?: number;
  categoryName?: string;
  requester: UserSummary;
  assignee?: UserSummary;
  location?: string;
  dueDate?: string;
  slaMinutes?: number;
  cmdbAsset?: string;
  comments?: Comment[];
  tags?: string[];
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export type TicketStatus = 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TicketType = 'INCIDENT' | 'PROBLEM' | 'REQUEST' | 'CHANGE';

export interface Comment {
  id: number;
  content: string;
  author: UserSummary;
  internal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  fullPath: string;
  parentId?: number;
  slaMinutes?: number;
  children?: Category[];
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
}

export interface DashboardStats {
  totalTickets: number;
  pendingTickets: number;
  resolvedTickets: number;
  criticalTickets: number;
  overdueTickets: number;
  newToday: number;
  resolvedToday: number;
  totalUsers: number;
  ldapUsers: number;
}

export interface KnowledgeCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  articleCount: number;
}

export interface KnowledgeArticle {
  id: number;
  title: string;
  content?: string;
  categoryId?: number;
  categoryName?: string;
  author?: UserSummary;
  published: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LdapConfig {
  id?: number;
  serverUrl: string;
  port: number;
  useSsl: boolean;
  baseDn: string;
  bindDn?: string;
  userSearchBase?: string;
  userSearchFilter?: string;
  groupSearchBase?: string;
  groupSearchFilter?: string;
  searchScope: string;
  importDisabledAccounts: boolean;
  attrLogin: string;
  attrFirstName: string;
  attrLastName: string;
  attrEmail: string;
  attrPhone: string;
  attrDepartment: string;
  attrJobTitle: string;
  syncIntervalMinutes: number;
  adRemovalAction: string;
  authMethod: string;
  autoCreateOnLogin: boolean;
  sendWelcomeEmail: boolean;
  logSyncOperations: boolean;
  lastSyncAt?: string;
}

export interface LdapGroupMapping {
  id?: number;
  adGroupName: string;
  ticketFlowRole: string;
  priority: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface AuthResponse {
  token: string;
  username: string;
  fullName: string;
  role: string;
}
