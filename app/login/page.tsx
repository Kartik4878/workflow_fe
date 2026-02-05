"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "../components/button"
import { Input } from "../components/input"
import { Label } from "../components/label"

const loginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"
      
      const response = await axios.get(`${API_BASE}/operators/operator`, {
        headers: {
          "x-user-id": data.userId,
        },
      })

      const userData = response.data

      // Store in localStorage as per original app.js
      localStorage.setItem("userId", data.userId)
      localStorage.setItem("role", userData.role)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Invalid User ID or Password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-20 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg border-t-4 border-yellow-400">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="userId" className="block font-medium text-gray-700">
              User ID
            </Label>
            <Input
              id="userId"
              type="text"
              className="focus-visible:ring-yellow-400"
              {...register("userId")}
            />
            {errors.userId && (
              <p className="text-sm text-red-500">{errors.userId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="block font-medium text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              className="focus-visible:ring-yellow-400"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            variant="yellow" 
            className="w-full font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  )
}