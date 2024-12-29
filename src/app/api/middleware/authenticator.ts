import { HTTP_STATUS } from "@/constants/common";
import { NextRequest, NextResponse } from "next/server";
import AuthProvider from "../utils/auth";

export function AuthGuard(){
    return function(target: any, key: any, descriptor: any) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any) {

            const req: NextRequest = args[0];
            const res: NextResponse = args[0];
            const headers = req.headers;

            const Authorization = headers.get('authorization')

            if (!Authorization) {
                return NextResponse.json(
                    {
                        message: "Not Authorized"
                    },
                    { status: HTTP_STATUS.UNAUTHORIZED }
                );
            }

            const BearerToken = Authorization.split('Bearer ')[1];

            if (!BearerToken) {
                return NextResponse.json(
                    {
                        message: "Not Authorized"
                    },
                    { status: HTTP_STATUS.UNAUTHORIZED }
                );
            }

            const validated: any = AuthProvider.verify(BearerToken)

            if (!(validated && validated.userId)) {
                return NextResponse.json(
                    {
                        message: "Not Authorized"
                    },
                    { status: HTTP_STATUS.UNAUTHORIZED }
                );
            }

            args[0].userId = validated.userId;
      
            return originalMethod.apply(this, args);
          };

        return descriptor;
    }
}