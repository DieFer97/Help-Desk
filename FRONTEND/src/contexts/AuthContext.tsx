"use client"

/* eslint-disable react-refresh/only-export-components */

import type React from "react"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "./auth"

interface User {
  id: number
  email: string
  nombre: string
  tipo_usuario: string
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken")
    const storedUser = localStorage.getItem("authUser")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      setToken(data.token)
      setUser(data.user)

      localStorage.setItem("authToken", data.token)
      localStorage.setItem("authUser", JSON.stringify(data.user))
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, nombre: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, clienteNombre: nombre }),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const data = await response.json()
      setToken(data.token)
      setUser(data.user)

      localStorage.setItem("authToken", data.token)
      localStorage.setItem("authUser", JSON.stringify(data.user))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
