"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { registerUser, verifyCredentials, type StoredUser } from "./users"

interface AuthContextType {
  user: StoredUser | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = () => {
      try {
        const session = localStorage.getItem("gensyn-session")
        if (session) {
          const userData = JSON.parse(session)
          setUser(userData)
        }
      } catch (error) {
        console.error("Invalid session data:", error)
        localStorage.removeItem("gensyn-session")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      const pathname = window.location.pathname
      const isAuthRoute = pathname === "/login" || pathname === "/register"

      if (!user && !isAuthRoute) {
        router.push("/login")
      } else if (user && isAuthRoute) {
        router.push("/")
      }
    }
  }, [user, isLoading, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Validate email format
      if (!isValidEmail(email)) {
        throw new Error("Invalid email format")
      }

      // Validate password
      if (!isValidPassword(password)) {
        throw new Error("Password must be at least 6 characters long")
      }

      // Verify credentials
      const userData = verifyCredentials(email, password)
      
      // Store session
      localStorage.setItem("gensyn-session", JSON.stringify(userData))
      setUser(userData)
      router.push("/")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Validate email format
      if (!isValidEmail(email)) {
        throw new Error("Invalid email format")
      }

      // Validate password
      if (!isValidPassword(password)) {
        throw new Error("Password must be at least 6 characters long")
      }

      // Validate username
      if (!username || username.length < 3) {
        throw new Error("Username must be at least 3 characters long")
      }

      // Register new user
      const userData = registerUser(username, email, password)
      
      // Store session
      localStorage.setItem("gensyn-session", JSON.stringify(userData))
      setUser(userData)
      router.push("/")
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear all user-related data
    localStorage.removeItem("gensyn-session")
    localStorage.removeItem("gensyn-users")
    localStorage.removeItem("gensyn-nodes")
    localStorage.removeItem("gensyn-notifications")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
