"use client"

import AuthLayout from "@/components/layouts/AuthLayout"
import Button from "@/components/subcomponents/button"
import Link from "next/link"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
    }

    setIsLoading(true)
    try {
      // await dispatch.auth.changePassword({ newPassword, confirmPassword })
    } catch (error: any) {
      console.error("change-password failed:", error)
      setError(error.message || "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Change Password">
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
    </AuthLayout>
  )
}
