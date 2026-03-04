import { apiRequest } from './client';
import { get } from 'svelte/store';
import { PUBLIC_API_URL } from '$env/static/public';
import type {
  AdminStats,
  UserResponse,
  UserDetailResponse,
  KycDocumentResponse,
  KycReviewRequest,
  PageResponse,
  PendingVerificationUser
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
  },

  async getPendingVerificationUsers(page = 0, limit = 20): Promise<PageResponse<PendingVerificationUser>> {
    return apiRequest(`/admin/users/kyc-pending?page=${page}&limit=${limit}`, {}, true);
  },

  async getUserDetail(userId: string): Promise<UserDetailResponse> {
    return apiRequest(`/admin/users/${userId}/detail`, {}, true);
  },

  async getKycFileBlob(docId: string): Promise<{ url: string; mimeType: string }> {
    const { authStore } = await import('$lib/stores/auth');
    const { accessToken } = get(authStore);
    const response = await fetch(`${PUBLIC_API_URL}/admin/kyc/${docId}/file?inline=true`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    });
    if (!response.ok) throw new Error('Fichier introuvable');
    const blob = await response.blob();
    return { url: URL.createObjectURL(blob), mimeType: blob.type };
  }
};
