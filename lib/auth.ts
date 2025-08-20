import { prisma } from "@/prisma/db";
import { USER_ROLE } from "@/prisma/generated/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { sendMail } from "./sendMail";
import {
  ResetPasswordEmailTemplate,
  VerificationEmailTemplate,
} from "@/templates/Email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      const link = new URL(url);
      await sendMail(user.email, ResetPasswordEmailTemplate({ link }));
    },
    // onPasswordReset: async ({ user }) => {
    //   console.log(`Password for user ${user.email} has been reset.`);
    // },
  },

  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60 * 3,
    autoSignInAfterVerification: true,
    callbackURL: "/verify-email", // Redirect after verification
    sendVerificationEmail: async ({ user, url }) => {
      const link = new URL(url);
      link.searchParams.set("callbackURL", "/verify-email");
      await sendMail(user.email, VerificationEmailTemplate({ link }));
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: [USER_ROLE.USER, USER_ROLE.ADMIN],
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];

          if (ADMIN_EMAILS.includes(user.email)) {
            return { data: { ...user, role: USER_ROLE.ADMIN } };
          }
          return { data: user };
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
