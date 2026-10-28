import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const API_BASE_URL = 'http://localhost:5000/api'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ppis_admin_token') || null)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ppis_admin_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  // Login handler
  const login = async (email, password) => {
    setLoading(true)
    setAuthError('')
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login. Please check your credentials.')
      }

      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('ppis_admin_token', data.token)
      localStorage.setItem('ppis_admin_user', JSON.stringify(data.user))
      return { success: true }
    } catch (err) {
      setAuthError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Logout handler
  const logout = () => {
    setToken(null)
    setUser(null)
    setAuthError('')
    localStorage.removeItem('ppis_admin_token')
    localStorage.removeItem('ppis_admin_user')
  }

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
    }
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading,
    authError,
    login,
    logout,
    getAuthHeaders,
    apiBaseUrl: API_BASE_URL,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
