// check session and give true or false based on admin role

import { auth, Session } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// let session :Session|null = null; // Cache for the session to avoid multiple calls

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("new Session fetched");
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
