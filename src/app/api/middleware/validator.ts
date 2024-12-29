import { HTTP_STATUS } from "@/constants/common";
import { plainToInstance as convertor } from "class-transformer";
import { validate } from "class-validator";
import { NextResponse } from "next/server";

export function ValidateBody(dtoClass: any) {
  return function (target: any, key: any, descriptor: any) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: { payload: unknown[]; }[]) {
      const req: any = args[0];
      const body = await req.json();

      const object = convertor(dtoClass, body);
      const errors = await validate(object);

      if (errors.length > 0) {
        const errorMessages = errors.map((err: any) =>
          Object.values(err.constraints).join(", ")
        );

        const error = errorMessages.join("; ");
        return NextResponse.json(
          {
            message: error
          },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      args[0].payload = object as typeof dtoClass;
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
