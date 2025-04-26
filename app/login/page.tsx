"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    setIsLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Login failed. Please check your credentials.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gensyn-bg p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-normal tracking-wide">GENSYN TESTNET DASHBOARD</h1>
        </div>

        <div className="border border-gensyn-text p-8 bg-gensyn-bg">
          <div className="mb-6">
            <h2 className="text-xl font-normal text-center">LOGIN</h2>
            <p className="mt-2 text-sm text-center">Welcome back to Gensyn Testnet</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                EMAIL
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gensyn-text bg-gensyn-muted/30 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                PASSWORD
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gensyn-text bg-gensyn-muted/30 focus:outline-none"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gensyn-text text-gensyn-bg py-2 disabled:opacity-50"
            >
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </button>

            <div className="text-center">
              <p className="text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="underline hover:text-gensyn-accent">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>

        <footer className="py-4 text-center text-sm mt-8">
          <p>
            Crafted by{" "}
            <a href="https://x.com/0xemir_" className="underline" target="_blank" rel="noopener noreferrer">
              0xemir_
            </a>{" "}
            for the{" "}
            <a href="https://gensyn.ai" className="underline" target="_blank" rel="noopener noreferrer">
              Gensyn
            </a>{" "}
            community
          </p>
        </footer>
      </div>
    </div>
  )
}
