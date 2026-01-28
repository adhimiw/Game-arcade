import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

interface User {
  id: string
  username: string
  email: string
  avatar?: string
  firstName?: string
  lastName?: string
  createdAt: string
  scores: Score[]
}

interface Score {
  id: string
  game: string
  score: number
  difficulty?: string
  time?: number
  mistakes?: number
  createdAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  initializeAuth: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Configure axios defaults
axios.defaults.baseURL = API_URL
axios.defaults.withCredentials = true

// Request interceptor to add auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const response = await axios.post('/api/auth/refresh', { refreshToken })
          const { token } = response.data
          localStorage.setItem('auth_token', token)
          
          // Retry the original request
          error.config.headers.Authorization = `Bearer ${token}`
          return axios(error.config)
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      } else {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      initializeAuth: async () => {
        const token = localStorage.getItem('auth_token')
        const refreshToken = localStorage.getItem('refresh_token')
        
        if (token) {
          try {
            set({ isLoading: true })
            const response = await axios.get('/api/auth/me')
            set({
              user: response.data.user,
              token,
              refreshToken,
              isAuthenticated: true,
              isLoading: false,
            })
          } catch (error) {
            // Token might be expired, try refresh
            if (refreshToken) {
              try {
                await get().refreshAuth()
              } catch (refreshError) {
                set({
                  user: null,
                  token: null,
                  refreshToken: null,
                  isAuthenticated: false,
                  isLoading: false,
                })
              }
            } else {
              set({
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
              })
            }
          }
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await axios.post('/api/auth/login', {
            email,
            password,
          })
          
          const { token, refreshToken, user } = response.data
          
          localStorage.setItem('auth_token', token)
          localStorage.setItem('refresh_token', refreshToken)
          
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await axios.post('/api/auth/register', {
            username,
            email,
            password,
          })
          
          const { token, refreshToken, user } = response.data
          
          localStorage.setItem('auth_token', token)
          localStorage.setItem('refresh_token', refreshToken)
          
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      refreshAuth: async () => {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) throw new Error('No refresh token')
        
        try {
          const response = await axios.post('/api/auth/refresh', { refreshToken })
          const { token, user } = response.data
          
          localStorage.setItem('auth_token', token)
          
          set({
            user,
            token,
            isAuthenticated: true,
          })
        } catch (error) {
          throw error
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        try {
          const response = await axios.put('/api/auth/profile', updates)
          set({ user: response.data.user })
        } catch (error) {
          throw error
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
)