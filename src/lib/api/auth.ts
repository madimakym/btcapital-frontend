import { apiRequest } from './client';
import { authStore } from '$lib/stores/auth';
import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '$lib/types';

export const authApi = {
  async register(data: RegisterRequest): Promise<{ message: string }> {
    return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }, false);
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiRequest(`/auth/verify?token=${token}`, {}, false);
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiRequest<LoginResponse>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(data) },
      false
    );
    authStore.login(response);
    return response;
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      authStore.logout();
    }
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    return apiRequest(
      '/auth/forgot-password',
      { method: 'POST', body: JSON.stringify(data) },
      false
    );
  },

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return apiRequest(
      '/auth/reset-password',
      { method: 'POST', body: JSON.stringify(data) },
      false
    );
  }
};
