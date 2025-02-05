import EmailService from "@/app/api/lib/EmailService.lib"
import resetPasswordModel from "@/app/api/models/reset-password.model"
import AuthProvider from "@/app/api/utils/auth"
import DatabaseService from "@/app/api/utils/db"
import { HTTP_STATUS } from "@/constants/common"
import dayjs from "dayjs"
import { NextResponse } from "next/server"

class ForgotPasswordController {
  async GET(req: Request) {
    await DatabaseService.connect()

    try {
      const { searchParams } = new URL(req.url)
      const token = searchParams.get("token") || ""
      const email = searchParams.get("email") || ""

      if (!token || !email) {
        return NextResponse.json(
          {
            message: "Token and email are required",
            status: HTTP_STATUS.BAD_REQUEST,
          },
          { status: HTTP_STATUS.BAD_REQUEST }
        )
      }

      const resetPasswordReq = await resetPasswordModel.findOne({
        email: email,
        token: token,
      })

      if (!resetPasswordReq) {
        return NextResponse.json(
          {
            message: "Invalid token or email",
            status: HTTP_STATUS.BAD_REQUEST,
          },
          { status: HTTP_STATUS.BAD_REQUEST }
        )
      }

      if (dayjs().isAfter(resetPasswordReq.expires_at)) {
        return NextResponse.json(
          {
            message: "Token has expired. Please request a new one.",
            status: HTTP_STATUS.BAD_REQUEST,
          },
          { status: HTTP_STATUS.BAD_REQUEST }
        )
      }

      return NextResponse.json(
        {
          message: "Token is valid",
          status: HTTP_STATUS.OK,
        },
        { status: HTTP_STATUS.OK }
      )
    } catch (error) {
      return NextResponse.json(
        {
          message: "Invalid request",
          status: HTTP_STATUS.BAD_REQUEST,
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }
  }

  async POST(req: Request) {
    await DatabaseService.connect()

    try {
      const email = await req.json()

      if (!email) {
        return NextResponse.json(
          {
            message: "Email is required",
          },
          {
            status: HTTP_STATUS.BAD_REQUEST,
          }
        )
      }

      const forgotPassReqToken = AuthProvider.generateResetPasswordToken()

      resetPasswordModel.create({
        email: email,
        token: forgotPassReqToken,
        expires_at: dayjs().add(15, "minute").toDate(),
      })

      await EmailService.sendChangePasswordToken(email, forgotPassReqToken)

      return NextResponse.json({
        message: "Email sent",
        status: HTTP_STATUS.OK,
      })
    } catch (error) {
      return NextResponse.json(
        {
          message: "Invalid request body",
        },
        {
          status: HTTP_STATUS.BAD_REQUEST,
        }
      )
    }
  }
}

export const GET = async (req: Request, res: Response) => {
  const controller = new ForgotPasswordController()
  try {
    await controller.GET(req)
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

export const POST = async (req: Request, res: Response) => {
  const controller = new ForgotPasswordController()
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
