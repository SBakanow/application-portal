import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    sessionExpiresAt: null,
    sessionTimeout: null,
  }),
  actions: {
    async checkAuth() {
      try {
        const response = await axios.post('/api/auth/validate', { withCredentials: true })
        const { username, expiresAt } = response.data

        this.isAuthenticated = true
        this.user = { username }
        this.setSessionExpiry(expiresAt)
      } catch (error) {
        console.warn('Failed to authenticate')
        this.clearAuthStatus()
      }
    },
    setSessionExpiry(expiresAt) {
      this.sessionExpiresAt = expiresAt

      if (this.sessionTimeout) clearTimeout(this.sessionTimeout)

      const timeUntilExpiry = new Date(expiresAt).getTime() - Date.now()
      this.sessionTimeout = setTimeout(() => {
        this.clearAuthStatus()
        alert('Session expired, please log in again.')
      }, timeUntilExpiry)
    },
    clearAuthStatus() {
      this.isAuthenticated = false
      this.user = null
      this.sessionExpiresAt = null
      if (this.sessionTimeout) clearTimeout(this.sessionTimeout)
      this.sessionTimeout = null
    },
    async logout() {
      await axios.post('/api/auth/logout', {}, { withCredentials: true })
      this.clearAuthStatus()
    },
  },
})
