"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const { register } = useAuth()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !email || !password) {
      setError("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)
    try {
      await register(username, email, password)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Registration failed. Please try again.")
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
            <h2 className="text-xl font-normal text-center">CREATE ACCOUNT</h2>
            <p className="mt-2 text-sm text-center">Join the Gensyn Testnet community</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">
                USERNAME
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gensyn-text bg-gensyn-muted/30 focus:outline-none"
                required
                minLength={3}
              />
            </div>

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

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                CONFIRM PASSWORD
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? "REGISTERING..." : "REGISTER"}
            </button>

            <div className="text-center">
              <p className="text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline hover:text-gensyn-accent">
                  Login
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
