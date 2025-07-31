// check session and give true or false based on admin role

import { auth, Session } from "@/lib/auth";
import { headers } from "next/headers";


// let session :Session|null = null; // Cache for the session to avoid multiple calls

async function getSessionOnce() {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    console.log("new Session fetched");
  return session;
}

export async function checkIsAdmin() {
  const session = await getSessionOnce();
  if (!session) return false;
  return session.user.role === "ADMIN";
}

export async function checkIsLoggedIn() {
  const session = await getSessionOnce();
  return !!session;
}

export async function getSession() {
  return await getSessionOnce();
}

