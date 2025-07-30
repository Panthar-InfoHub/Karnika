import { prisma } from "@/prisma/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user:{
    additionalFields:{
     role:{
      type:["USER", "ADMIN"],
      input:false
     }
    }
  }
});

// export type Session = typeof auth.$Infer.Session

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";