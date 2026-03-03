// ==================== Enums ====================

export type UserRole = 'INVESTOR' | 'ENTREPRENEUR' | 'INCUBATOR' | 'ADMIN';
export type UserStatus = 'PENDING_VERIFICATION' | 'KYC_PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';
export type KycDocType =
  | 'NATIONAL_ID'
  | 'PASSPORT'
  | 'PROOF_OF_ADDRESS'
  | 'KBIS'
  | 'STATUTES';
export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type KycDecision = 'APPROVE' | 'REJECT';

// ==================== Auth ====================

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  cgvVersion?: string;
  acceptMarketing?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserResponse;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ==================== User ====================

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type User = UserResponse;

// ==================== Profiles ====================

export interface InvestorProfileRequest {
  bio?: string;
  country?: string;
  city?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  investmentRangeMin?: number;
  investmentRangeMax?: number;
  preferredSectors?: string[];
  investmentStages?: string[];
}

export interface EntrepreneurProfileRequest {
  bio?: string;
  country?: string;
  city?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  companyName?: string;
  companyDescription?: string;
  sector?: string;
  stage?: string;
  fundingNeeded?: number;
}

export interface IncubatorProfileRequest {
  bio?: string;
  country?: string;
  city?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  incubatorName?: string;
  description?: string;
  focusSectors?: string[];
  programDuration?: string;
  maxStartups?: number;
}

export type AnyProfileRequest =
  | InvestorProfileRequest
  | EntrepreneurProfileRequest
  | IncubatorProfileRequest;

// ==================== KYC ====================

export interface KycDocumentResponse {
  id: string;
  userId: string;
  documentType: KycDocType;
  status: KycStatus;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewComment?: string;
}

export interface KycReviewRequest {
  decision: KycDecision;
  comment?: string;
}

// ==================== Admin ====================

export interface KycDocSummary {
  id: string;
  documentType: KycDocType;
  status: KycStatus;
  submittedAt: string;
}

export interface PendingVerificationUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  kycDocuments: KycDocSummary[];
}



export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingVerification: number;
  suspended: number;
  investors: number;
  entrepreneurs: number;
  incubators: number;
  admins: number;
  pendingKyc: number;
}

// ==================== Common ====================

export interface PageMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PageResponse<T> {
  content: T[];
  meta: PageMeta;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string>;
}

// ==================== UI Helpers ====================

export const ROLE_LABELS: Record<UserRole, string> = {
  INVESTOR: 'Investisseur',
  ENTREPRENEUR: 'Entrepreneur',
  INCUBATOR: 'Incubateur',
  ADMIN: 'Administrateur'
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  PENDING_VERIFICATION: 'En attente de vérification',
  KYC_PENDING: 'KYC en attente',
  ACTIVE: 'Actif',
  SUSPENDED: 'Suspendu',
  DELETED: 'Supprimé'
};

export const KYC_DOC_LABELS: Record<KycDocType, string> = {
  NATIONAL_ID: "Carte nationale d'identité",
  PASSPORT: 'Passeport',
  PROOF_OF_ADDRESS: 'Justificatif de domicile',
  KBIS: 'Extrait KBIS',
  STATUTES: 'Statuts de la société'
};

export const KYC_STATUS_LABELS: Record<KycStatus, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté'
};

export const SECTORS = [
  'Fintech',
  'Healthtech',
  'Edtech',
  'Agritech',
  'E-commerce',
  'Immobilier',
  'Energie',
  'Logistique',
  'SaaS',
  'IA & Data',
  'Autre'
];

export const INVESTMENT_STAGES = [
  'Pre-seed',
  'Seed',
  'Série A',
  'Série B',
  'Série C+',
  'Growth'
];
