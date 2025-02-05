"use client"

import AuthLayout from "@/components/layouts/AuthLayout"
import Button from "@/components/subcomponents/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Router from "next/router"
import { FormEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"

export default function ChangePasswordPage() {
  const dispatch = useDispatch()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)

  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""

  console.log(token, email)

  useEffect(() => {
    if (!token || !email) {
      setIsTokenValid(false)
      setError("Invalid token")
    }
  }, [token, email])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      const response = await dispatch.auth.resetPassword({
        email,
        token,
        newPassword,
        confirmPassword,
      })

      if (response.success) {
        toast.success("Password reset successfully")
        Router.push("/auth/login")
      }
    } catch (error: any) {
      console.error("change-password failed:", error)
      setError(error.message || "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset Password">
      {isLoading ? (
        <p className="text-center text-gray-500">Validating token...</p>
      ) : isTokenValid === false ? (
        <>
          <div className="flex flex-col gap-3">
            <p className="text-center text-red-500">{error}</p>

            <Link
              href="/auth/forgot-password"
              className="font-medium text-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Button text="Retry"></Button>
            </Link>
          </div>
        </>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              New Password
            </label>
            <div className="mt-1">
              <input
                id="new-password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                required
                className="block w-full appearance-none rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm 
                                  dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
                                  border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="block w-full appearance-none rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm 
                                  dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
                                  border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <Button type="submit" text="Save" />
          </div>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Remembered your password?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </span>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
