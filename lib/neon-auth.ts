"use client"

import { createAuthClient } from "@neondatabase/neon-js/auth"

const neonAuthUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL

if (!neonAuthUrl) {
  throw new Error("Missing NEXT_PUBLIC_NEON_AUTH_URL environment variable")
}

export const neonAuth = createAuthClient(neonAuthUrl)
