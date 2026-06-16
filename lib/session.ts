/**
 * lib/session.ts
 * Minimal cookie-based session — stores userId in an HttpOnly cookie.
 * No external auth library needed.
 */

import { cookies } from "next/headers";

const COOKIE_NAME = "pc_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Save userId into the session cookie (call from route handlers). */
export async function setSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Read userId from the session cookie. Returns null if not logged in. */
export async function getSession(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

/** Clear the session cookie (logout). */
export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
