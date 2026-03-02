import { apiRequest } from './client';
import { authStore } from '$lib/stores/auth';
import type {
  UserResponse,
  InvestorProfileRequest,
  EntrepreneurProfileRequest,
  IncubatorProfileRequest
} from '$lib/types';

export const profileApi = {
  async getMe(): Promise<UserResponse> {
    const user = await apiRequest<UserResponse>('/me', {}, true);
    authStore.setUser(user);
    return user;
  },

  async updateMe(data: Partial<Pick<UserResponse, 'firstName' | 'lastName'>>): Promise<UserResponse> {
    const user = await apiRequest<UserResponse>('/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    }, true);
    authStore.setUser(user);
    return user;
  },

  async getInvestorProfile(): Promise<InvestorProfileRequest> {
    return apiRequest('/me/profile/investor', {}, true);
  },

  async updateInvestorProfile(data: InvestorProfileRequest): Promise<InvestorProfileRequest> {
    return apiRequest('/me/profile/investor', { method: 'PUT', body: JSON.stringify(data) }, true);
  },

  async getEntrepreneurProfile(): Promise<EntrepreneurProfileRequest> {
    return apiRequest('/me/profile/entrepreneur', {}, true);
  },

  async updateEntrepreneurProfile(
    data: EntrepreneurProfileRequest
  ): Promise<EntrepreneurProfileRequest> {
    return apiRequest('/me/profile/entrepreneur', { method: 'PUT', body: JSON.stringify(data) }, true);
  },

  async getIncubatorProfile(): Promise<IncubatorProfileRequest> {
    return apiRequest('/me/profile/incubator', {}, true);
  },

  async updateIncubatorProfile(data: IncubatorProfileRequest): Promise<IncubatorProfileRequest> {
    return apiRequest('/me/profile/incubator', { method: 'PUT', body: JSON.stringify(data) }, true);
  }
};
