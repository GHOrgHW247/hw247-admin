import api from './api'
import { AdminUser, AuthResponse } from './types'

/**
 * Admin authentication service
 */
export class AuthService {
  /**
   * Login with email and password
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/admin/auth/login', { email, password })
    const { access_token, user } = response.data

    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', access_token)
      localStorage.setItem('admin_user', JSON.stringify(user))
    }

    return { access_token, user }
  }

  /**
   * Logout current user
   */
  static async logout(): Promise<void> {
    try {
      await api.post('/admin/auth/logout')
    } catch (err) {
      // Ignore logout errors, just clear local state
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
      }
    }
  }

  /**
   * Get current user from storage
   */
  static getCurrentUser(): AdminUser | null {
    if (typeof window === 'undefined') return null

    const userStr = localStorage.getItem('admin_user')
    return userStr ? JSON.parse(userStr) : null
  }

  /**
   * Get auth token from storage
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('admin_token')
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getToken() !== null
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(permission: string): boolean {
    const user = this.getCurrentUser()
    return user ? user.permissions.includes(permission) : false
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: 'super_admin' | 'admin' | 'operator'): boolean {
    const user = this.getCurrentUser()
    return user ? user.role === role : false
  }
}
