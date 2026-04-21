import { createRemoteJWKSet, jwtVerify } from "jose"

const neonAuthUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL
const neonJwksUrl = process.env.NEON_JWKS_URL

if (!neonAuthUrl || !neonJwksUrl) {
  throw new Error("Missing Neon auth environment variables for server auth verification")
}

const jwks = createRemoteJWKSet(new URL(neonJwksUrl))
const issuer = new URL(neonAuthUrl).origin

export async function getUserIdFromBearerToken(authHeader: string | null): Promise<string | null> {
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }

  const accessToken = authHeader.slice("Bearer ".length)
  if (!accessToken) {
    return null
  }

  try {
    const { payload } = await jwtVerify(accessToken, jwks, {
      issuer,
    })
    const userId = typeof payload.sub === "string" ? payload.sub : null
    return userId
  } catch {
    return null
  }
}
