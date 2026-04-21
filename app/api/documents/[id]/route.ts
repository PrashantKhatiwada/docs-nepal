import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { getUserIdFromBearerToken } from "@/lib/server-auth"
import type { DocumentUpdate } from "@/lib/db-types"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserIdFromBearerToken(request.headers.get("authorization"))
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rows = await sql`
    SELECT id, user_id, template_id, title, form_data, language, created_at, updated_at
    FROM documents
    WHERE id = ${params.id} AND user_id = ${userId}
    LIMIT 1
  `

  if (!rows.length) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  return NextResponse.json(rows[0])
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserIdFromBearerToken(request.headers.get("authorization"))
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as DocumentUpdate
  const existing = await sql`
    SELECT id, user_id, template_id, title, form_data, language, created_at, updated_at
    FROM documents
    WHERE id = ${params.id} AND user_id = ${userId}
    LIMIT 1
  `

  if (!existing.length) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  const current = existing[0]
  const nextTitle = body.title ?? current.title
  const nextFormData = body.form_data ?? current.form_data
  const nextLanguage = body.language ?? current.language

  const rows = await sql`
    UPDATE documents
    SET title = ${nextTitle},
        form_data = ${JSON.stringify(nextFormData)},
        language = ${nextLanguage},
        updated_at = NOW()
    WHERE id = ${params.id} AND user_id = ${userId}
    RETURNING id, user_id, template_id, title, form_data, language, created_at, updated_at
  `

  return NextResponse.json(rows[0])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserIdFromBearerToken(request.headers.get("authorization"))
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await sql`
    DELETE FROM documents
    WHERE id = ${params.id} AND user_id = ${userId}
  `

  return NextResponse.json({ ok: true })
}
