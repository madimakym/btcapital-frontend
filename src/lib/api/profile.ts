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
    const user = await apiRequest<UserResponse>('/me');
    authStore.setUser(user);
    return user;
  },

  async updateMe(data: Partial<Pick<UserResponse, 'firstName' | 'lastName'>>): Promise<UserResponse> {
    const user = await apiRequest<UserResponse>('/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    authStore.setUser(user);
    return user;
  },

  async getInvestorProfile(): Promise<InvestorProfileRequest> {
    return apiRequest('/me/profile/investor');
  },

  async updateInvestorProfile(data: InvestorProfileRequest): Promise<InvestorProfileRequest> {
    return apiRequest('/me/profile/investor', { method: 'PUT', body: JSON.stringify(data) });
  },

  async getEntrepreneurProfile(): Promise<EntrepreneurProfileRequest> {
    return apiRequest('/me/profile/entrepreneur');
  },

  async updateEntrepreneurProfile(
    data: EntrepreneurProfileRequest
  ): Promise<EntrepreneurProfileRequest> {
    return apiRequest('/me/profile/entrepreneur', { method: 'PUT', body: JSON.stringify(data) });
  },

  async getIncubatorProfile(): Promise<IncubatorProfileRequest> {
    return apiRequest('/me/profile/incubator');
  },

  async updateIncubatorProfile(data: IncubatorProfileRequest): Promise<IncubatorProfileRequest> {
    return apiRequest('/me/profile/incubator', { method: 'PUT', body: JSON.stringify(data) });
  }
};
