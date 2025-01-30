import { AuthGuard } from "@/app/api/middleware/authenticator"
import { HTTP_STATUS } from "@/constants/common"
import { NextResponse } from "next/server"

class ForgotPasswordController {
  @AuthGuard()
  async POST(req: Request) {}
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
