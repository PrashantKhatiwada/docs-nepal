import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { getUserIdFromBearerToken } from "@/lib/server-auth"
import type { DocumentInsert } from "@/lib/db-types"

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromBearerToken(request.headers.get("authorization"))
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rows = await sql`
    SELECT id, user_id, template_id, title, form_data, language, created_at, updated_at
    FROM documents
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `

  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromBearerToken(request.headers.get("authorization"))
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as DocumentInsert
  const { template_id, title, form_data, language } = body

  if (!template_id || !title || !form_data || !language) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const rows = await sql`
    INSERT INTO documents (user_id, template_id, title, form_data, language)
    VALUES (${userId}, ${template_id}, ${title}, ${JSON.stringify(form_data)}, ${language})
    RETURNING id, user_id, template_id, title, form_data, language, created_at, updated_at
  `

  return NextResponse.json(rows[0], { status: 201 })
}
