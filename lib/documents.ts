import { neonAuth } from "./neon-auth"
import type { DocumentInsert, DocumentRow, DocumentUpdate } from "./db-types"

async function getAuthHeaders() {
  const { data, error } = await neonAuth.getSession()
  if (error) {
    throw new Error(error.message)
  }

  const token = (data?.session as any)?.token || (data?.session as any)?.accessToken
  if (!token) {
    throw new Error("User not authenticated")
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || "Request failed")
  }

  return response.json()
}

export async function saveDocument(document: DocumentInsert): Promise<DocumentRow> {
  const headers = await getAuthHeaders()
  const response = await fetch("/api/documents", {
    method: "POST",
    headers,
    body: JSON.stringify(document),
  })
  return parseResponse<DocumentRow>(response)
}

export async function getUserDocuments(): Promise<DocumentRow[]> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch("/api/documents", {
      method: "GET",
      headers,
    })
    return await parseResponse<DocumentRow[]>(response)
  } catch (error) {
    console.warn("Failed to load user documents:", error)
    return []
  }
}

export async function getDocumentById(id: string): Promise<DocumentRow> {
  const headers = await getAuthHeaders()
  const response = await fetch(`/api/documents/${id}`, {
    method: "GET",
    headers,
  })
  return parseResponse<DocumentRow>(response)
}

export async function updateDocument(id: string, updates: DocumentUpdate): Promise<DocumentRow> {
  const headers = await getAuthHeaders()
  const response = await fetch(`/api/documents/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(updates),
  })
  return parseResponse<DocumentRow>(response)
}

export async function deleteDocument(id: string): Promise<void> {
  const headers = await getAuthHeaders()
  const response = await fetch(`/api/documents/${id}`, {
    method: "DELETE",
    headers,
  })
  await parseResponse<{ ok: boolean }>(response)
}

export async function trackTemplateUsage(templateId: string): Promise<void> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch("/api/template-usage", {
      method: "POST",
      headers,
      body: JSON.stringify({ template_id: templateId }),
    })
    await parseResponse<{ ok: boolean }>(response)
  } catch (error) {
    console.warn("Template usage tracking failed:", error)
  }
}

export async function getTemplateStats(): Promise<Record<string, number>> {
  try {
    const response = await fetch("/api/template-usage")
    return await parseResponse<Record<string, number>>(response)
  } catch (error) {
    console.warn("Template stats not available:", error)
    return {}
  }
}
