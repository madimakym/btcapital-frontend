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
    return apiRequest('/admin/stats', {}, true);
  },

  async getUsers(page = 0, size = 20): Promise<PageResponse<UserResponse>> {
    return apiRequest(`/admin/users?page=${page}&size=${size}`, {}, true);
  },

  async getUserKyc(userId: string): Promise<KycDocumentResponse[]> {
    return apiRequest(`/admin/users/${userId}/kyc`, {}, true);
  },

  async suspendUser(userId: string): Promise<UserResponse> {
    return apiRequest(`/admin/users/${userId}/suspend`, { method: 'PUT' }, true);
  },

  async activateUser(userId: string): Promise<UserResponse> {
    return apiRequest(`/admin/users/${userId}/activate`, { method: 'PUT' }, true);
  },

  async getPendingKyc(): Promise<KycDocumentResponse[]> {
    return apiRequest('/admin/kyc/pending', {}, true);
  },

  async reviewKyc(docId: string, data: KycReviewRequest): Promise<KycDocumentResponse> {
    return apiRequest(`/admin/kyc/${docId}/review`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, true);
  }
};
