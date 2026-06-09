// ============================================
// REBUILDYOURLIFE – SHARED TYPE DEFINITIONS
// ============================================

// ---- Enums ----

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  PREMIUM = 'PREMIUM',
}

export enum GoalTimeframe {
  YEAR = 'YEAR',
  QUARTER = 'QUARTER',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  DAY = 'DAY',
}

export enum GoalStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum DebtStatus {
  ACTIVE = 'ACTIVE',
  NEGOTIATING = 'NEGOTIATING',
  PAYMENT_PLAN = 'PAYMENT_PLAN',
  SETTLED = 'SETTLED',
  DISPUTED = 'DISPUTED',
}

export enum MemoryType {
  SHORT_TERM = 'SHORT_TERM',
  LONG_TERM = 'LONG_TERM',
  SUMMARY = 'SUMMARY',
  CONTEXT = 'CONTEXT',
}

export enum AgentType {
  CEO = 'CEO',
  LIFE_COACH = 'LIFE_COACH',
  RECOVERY = 'RECOVERY',
  FINANCIAL = 'FINANCIAL',
  DEBT_ENGINE = 'DEBT_ENGINE',
  TASK_EXECUTOR = 'TASK_EXECUTOR',
  ANALYTICS = 'ANALYTICS',
}

export enum SubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

// ---- API Request Types ----

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  timeframe: GoalTimeframe;
  targetDate?: string;
  lifeAreaId?: string;
  parentGoalId?: string;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  status?: GoalStatus;
  progress?: number;
  targetDate?: string;
}

export interface CreateBudgetRequest {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  savingsTarget: number;
  categories?: CreateBudgetCategoryRequest[];
}

export interface CreateBudgetCategoryRequest {
  name: string;
  planned: number;
  actual: number;
}

export interface CreateDebtRequest {
  creditorName: string;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  minimumPayment: number;
  monthlyPayment: number;
  dueDate?: string;
  notes?: string;
  priority?: number;
}

export interface UpdateDebtRequest {
  creditorName?: string;
  currentBalance?: number;
  interestRate?: number;
  minimumPayment?: number;
  monthlyPayment?: number;
  dueDate?: string;
  status?: DebtStatus;
  notes?: string;
  priority?: number;
}

export interface AddPaymentRequest {
  amount: number;
  notes?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  goalId?: string;
  assignedAgentType?: AgentType;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedAgentType?: AgentType;
}

export interface AIChatRequest {
  message: string;
  conversationId?: string;
  agentType?: AgentType;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

// ---- API Response Types ----

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatarUrl: string | null;
  subscriptionTier: SubscriptionTier;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface GoalResponse {
  id: string;
  title: string;
  description: string | null;
  timeframe: GoalTimeframe;
  status: GoalStatus;
  progress: number;
  targetDate: string | null;
  lifeAreaId: string | null;
  parentGoalId: string | null;
  childGoals?: GoalResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetResponse {
  id: string;
  month: string;
  totalIncome: number;
  totalExpenses: number;
  savingsTarget: number;
  categories: BudgetCategoryResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategoryResponse {
  id: string;
  name: string;
  planned: number;
  actual: number;
}

export interface DebtResponse {
  id: string;
  creditorName: string;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  minimumPayment: number;
  monthlyPayment: number;
  dueDate: string | null;
  status: DebtStatus;
  notes: string | null;
  priority: number;
  payments?: DebtPaymentResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface DebtPaymentResponse {
  id: string;
  amount: number;
  paidAt: string;
  notes: string | null;
}

export interface DebtOverview {
  totalDebts: number;
  totalOwed: number;
  totalMonthlyPayments: number;
  totalPaid: number;
  debtsByStatus: Record<DebtStatus, number>;
}

export interface PayoffScenario {
  method: 'snowball' | 'avalanche';
  totalMonths: number;
  totalInterestPaid: number;
  totalPaid: number;
  monthlyBreakdown: PayoffMonth[];
}

export interface PayoffMonth {
  month: number;
  date: string;
  payments: { debtId: string; creditorName: string; amount: number; remainingBalance: number }[];
  totalPaid: number;
  totalRemaining: number;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  goalId: string | null;
  assignedAgentType: AgentType | null;
  createdAt: string;
  updatedAt: string;
}

export interface AIConversationResponse {
  id: string;
  agentType: AgentType;
  title: string;
  isActive: boolean;
  lastMessage?: AIMessageResponse;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessageResponse {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface AIChatResponse {
  conversationId: string;
  message: AIMessageResponse;
}

export interface AgentInfo {
  type: AgentType;
  name: string;
  description: string;
  specializations: string[];
  avatarEmoji: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
  timestamp: string;
  version: string;
}

export interface DashboardStats {
  activeGoals: number;
  completedGoals: number;
  monthlyBudgetBalance: number;
  totalDebt: number;
  tasksDueToday: number;
  tasksOverdue: number;
  activePrograms: number;
  monthlyBudget?: number;
  tasksDue?: number;
  goalsCompletedThisMonth?: number;
  debtPaidThisMonth?: number;
}

export interface Activity {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface AIAgent {
  id: string;
  name: string;
  specialization: string;
  status: 'online' | 'busy' | 'offline';
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// ---- Constants ----

export const MAX_DEBTS_PER_USER = 150;

export const AGENT_DEFINITIONS: AgentInfo[] = [
  {
    type: AgentType.CEO,
    name: 'CEO Coach',
    description: 'Jouw strategische leider. Bewaakt je visie, stelt prioriteiten en houdt het overzicht.',
    specializations: ['Strategie', 'Prioriteiten', 'Besluitvorming', 'Overzicht'],
    avatarEmoji: '👔',
  },
  {
    type: AgentType.LIFE_COACH,
    name: 'Life Coach',
    description: 'Helpt je met persoonlijke doelen, routines, motivatie en levensbalans.',
    specializations: ['Doelen', 'Routines', 'Motivatie', 'Mindset'],
    avatarEmoji: '🌟',
  },
  {
    type: AgentType.RECOVERY,
    name: 'Recovery Coach',
    description: 'Begeleidt je herstelprogramma\'s, bouwt structuur en volgt je voortgang.',
    specializations: ['Herstelplannen', 'Structuur', 'Voortgang', 'Milestones'],
    avatarEmoji: '🔄',
  },
  {
    type: AgentType.FINANCIAL,
    name: 'Financieel Adviseur',
    description: 'Beheert je budget, analyseert uitgaven en bouwt aan financiële stabiliteit.',
    specializations: ['Budget', 'Besparing', 'Inkomsten', 'Uitgaven'],
    avatarEmoji: '💰',
  },
  {
    type: AgentType.DEBT_ENGINE,
    name: 'Schulden Specialist',
    description: 'Berekent aflossingsroutes, beheert schuldeisers en simuleert scenario\'s.',
    specializations: ['Schulden', 'Aflossing', 'Scenario\'s', 'Onderhandeling'],
    avatarEmoji: '📊',
  },
  {
    type: AgentType.TASK_EXECUTOR,
    name: 'Taak Manager',
    description: 'Organiseert je taken, stelt herinneringen in en zorgt voor opvolging.',
    specializations: ['Planning', 'Taken', 'Herinneringen', 'Opvolging'],
    avatarEmoji: '✅',
  },
  {
    type: AgentType.ANALYTICS,
    name: 'Analytics Expert',
    description: 'Analyseert je data, ontdekt patronen en geeft actionable inzichten.',
    specializations: ['KPI\'s', 'Trends', 'Voorspellingen', 'Rapportages'],
    avatarEmoji: '📈',
  },
];
