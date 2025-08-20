// check session and give true or false based on admin role

import { auth } from "@/lib/auth";
import { headers } from "next/headers";


// let session :Session|null = null; // Cache for the session to avoid multiple calls

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function checkIsAdmin() {
  const session = await getSession();
  if (!session) return false;
  return session.user.role === "ADMIN";
}

export async function checkIsLoggedIn() {
  const session = await getSession();
  return !!session;
}