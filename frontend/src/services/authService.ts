import { api } from './api'
import type { User } from '@/types/auth'

export const authService = {
  // Get current authenticated user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  // Get Google login URL
  getGoogleLoginUrl: (): string => {
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/auth/google`
  },
}
