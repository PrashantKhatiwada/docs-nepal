import { neonAuth } from "./neon-auth"

async function getAuthHeaders() {
  const { data, error } = await neonAuth.getSession()
  if (error) throw new Error(error.message)
  const token = (data?.session as any)?.token || (data?.session as any)?.accessToken
  if (!token) throw new Error("User not authenticated")

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function trackEvent(eventName: string, templateId?: string, metadata?: Record<string, any>) {
  try {
    const headers = await getAuthHeaders()
    await fetch("/api/analytics", {
      method: "POST",
      headers,
      body: JSON.stringify({
        event_name: eventName,
        template_id: templateId ?? null,
        metadata: metadata ?? {},
      }),
    })
  } catch (error) {
    console.warn("Analytics tracking failed:", error)
  }
}
