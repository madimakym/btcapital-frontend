import { apiRequest } from './client';
import type {
  AdminStats,
  UserResponse,
  KycDocumentResponse,
  KycReviewRequest,
  PageResponse
} from '$lib/types';

export const adminApi = {
  async getStats(): Promise<AdminStats> {
    return apiRequest('/admin/stats');
  },

  async getUsers(page = 0, size = 20): Promise<PageResponse<UserResponse>> {
    return apiRequest(`/admin/users?page=${page}&size=${size}`);
  },

  async getUserKyc(userId: string): Promise<KycDocumentResponse[]> {
    return apiRequest(`/admin/users/${userId}/kyc`);
  },

  async suspendUser(userId: string): Promise<UserResponse> {
    return apiRequest(`/admin/users/${userId}/suspend`, { method: 'PUT' });
  },

  async activateUser(userId: string): Promise<UserResponse> {
    return apiRequest(`/admin/users/${userId}/activate`, { method: 'PUT' });
  },

  async getPendingKyc(): Promise<KycDocumentResponse[]> {
    return apiRequest('/admin/kyc/pending');
  },

  async reviewKyc(docId: string, data: KycReviewRequest): Promise<KycDocumentResponse> {
    return apiRequest(`/admin/kyc/${docId}/review`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};
