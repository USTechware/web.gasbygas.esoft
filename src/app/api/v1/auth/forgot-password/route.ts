import { AuthGuard } from "@/app/api/middleware/authenticator"
import DatabaseService from "@/app/api/utils/db"
import { HTTP_STATUS } from "@/constants/common"
import { NextResponse } from "next/server"

class ForgotPasswordController {
  @AuthGuard()
  async POST(req: Request) {
    await DatabaseService.connect()

    const payload = (req as any).payload

    console.log(payload)

    // const user = await User.findOne({ _id: userId })
    // if (!user) {
    //   return NextResponse.json(
    //     { message: "User not found" },
    //     { status: HTTP_STATUS.BAD_REQUEST }
    //   )
    // }

    // await EmailService.sendForgotPasswordEmail(user.email, user.name)
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
