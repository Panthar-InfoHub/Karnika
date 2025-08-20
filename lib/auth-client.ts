import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  plugins: [inferAdditionalFields<typeof auth>()],
});

// export type Session = typeof authClient.$Infer.Session
export const { signIn, signUp, useSession, sendVerificationEmail, requestPasswordReset, resetPassword } = authClient;
