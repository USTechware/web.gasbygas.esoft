import ResetPasswordSchema from "@/app/api/models/reset-password.model"
import User from "@/app/api/models/user.model"
import AuthProvider from "@/app/api/utils/auth"
import DatabaseService from "@/app/api/utils/db"
import { HTTP_STATUS } from "@/constants/common"
import { NextResponse } from "next/server"

class ResetPasswordController {
  async POST(req: Request) {
    try {
      await DatabaseService.connect()
      const { email, token, newPassword, confirmPassword } = await req.json()

      const user = await User.findOne({ email: email })
      console.log(user)
      if (!user) {
        return NextResponse.json(
          {
            message: "User not found",
          },
          {
            status: HTTP_STATUS.NOT_FOUND,
          }
        )
      }

      const passwordToken = await ResetPasswordSchema.findOne({
        email: email,
        token: token,
      })

      if (!passwordToken) {
        NextResponse.redirect("/auth/login")
        return NextResponse.json(
          {
            message: "Invalid or expired token",
          },
          {
            status: HTTP_STATUS.FORBIDDEN,
          }
        )
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          {
            message: "Passwords do not match",
          },
          {
            status: HTTP_STATUS.BAD_REQUEST,
          }
        )
      }

      const encryptPassword = await AuthProvider.encryptPassword(newPassword)

      user.password = encryptPassword
      await user.save()

      await ResetPasswordSchema.deleteOne({ email: email, token: token })

      return NextResponse.json({
        message: "Password reset successfully",
        status: HTTP_STATUS.OK,
      })
    } catch (error: any) {
      return NextResponse.json(
        {
          message: error.message || "Unknown error",
        },
        {
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        }
      )
    }
  }
}

export const POST = async (req: Request, res: Response) => {
  const controller = new ResetPasswordController()
  try {
    return await controller.POST(req)
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Unknown error",
      },
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      }
    )
  }
}
