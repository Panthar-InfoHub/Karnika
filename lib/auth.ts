import { prisma } from "@/prisma/db";
import { USER_ROLE } from "@/prisma/generated/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  // baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000" ||"http://192.168.1.10:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  emailAndPassword: {
    enabled: true,
    minPasswordLength:6,
  },
  user:{
    
    additionalFields:{
     role:{
      type:[USER_ROLE.USER, USER_ROLE.ADMIN],
      input:false
     }
    }
  },
  databaseHooks:{
    user:{
      create:{
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];

          if (ADMIN_EMAILS.includes(user.email)) {
           return {data:{...user, role: USER_ROLE.ADMIN}};
          }
          return {data:user};
        }
      }
    }
  },
  
  // TODO:  change this later - use only in development
  // trustedOrigins:[
  //   "http://localhost:3000",
  //   "http://192.168.1.10:3000"
  // ]

});

export type Session = typeof auth.$Infer.Session

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";