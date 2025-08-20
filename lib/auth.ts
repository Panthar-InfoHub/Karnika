import { prisma } from "@/prisma/db";
import { USER_ROLE } from "@/prisma/generated/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { sendMail } from "./sendMail";

export const auth = betterAuth({
  // baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000" ||"http://192.168.1.10:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendMail(user.email, {
        subject: "Reset your password - Karnika",
        text: `Click the link to reset your password: ${url}`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
            <p style="color: #666; line-height: 1.6;">
              You requested to reset your password for your Karnika account. Click the button below to reset your password.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" 
                 style="background-color: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </p>
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:
              <br>
              <a href="${url}" style="color: #ff6b35;">${url}</a>
            </p>
          </div>
        `,
      });
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60 * 3,
    autoSignInAfterVerification: true,
    callbackURL: "/verify-email", // Redirect after verification
    sendVerificationEmail: async ({ user, url }) => {
      const link = new URL(url);
      link.searchParams.set("callbackURL", "/verify-email");

      await sendMail(user.email, {
        subject: "Verify your email address - Karnika",
        text: `Click the link to verify your email: ${link}`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
            <p style="color: #666; line-height: 1.6;">
              Thank you for signing up for Karnika! Please click the button below to verify your email address.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" 
                 style="background-color: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              This link will expire in 3 hours. If you didn't request this, please ignore this email.
            </p>
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:
              <br>
              <a href="${link}" style="color: #ff6b35;">${link}</a>
            </p>
          </div>
        `,
      });
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

  // TODO:  change this later - use only in development
  // trustedOrigins:[
  //   "http://localhost:3000",
  //   "http://192.168.1.10:3000"
  // ]
});

export type Session = typeof auth.$Infer.Session;

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
