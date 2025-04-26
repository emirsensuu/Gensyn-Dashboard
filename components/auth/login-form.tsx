"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      setIsLoading(false)
      return
    }

    try {
      // In a real app, you would make an API call to authenticate the user
      // For now, we'll simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store user info in localStorage (in a real app, you'd use cookies or JWT)
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: formData.email,
          isLoggedIn: true,
        }),
      )

      // Redirect to dashboard
      router.push("/")
    } catch (err) {
      setError("Login failed. Please check your credentials.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            EMAIL
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="h-10 bg-[#caaca5]/30 border-[#260f06] focus-visible:ring-[#260f06]"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            PASSWORD
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="h-10 bg-[#caaca5]/30 border-[#260f06] focus-visible:ring-[#260f06]"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full bg-[#260f06] hover:bg-[#260f06]/80 text-[#f4d8d2]">
          {isLoading ? "LOGGING IN..." : "LOGIN"}
        </Button>

        <div className="text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <a href="/register" className="underline hover:text-[#260f06]">
              Register
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}
