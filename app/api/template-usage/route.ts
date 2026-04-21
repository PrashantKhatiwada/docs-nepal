import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { getUserIdFromBearerToken } from "@/lib/server-auth"

export async function GET() {
  const rows = await sql`
    SELECT template_id, COUNT(*)::int AS usage_count
    FROM template_usage
    GROUP BY template_id
  `

  const stats = rows.reduce(
    (acc: Record<string, number>, row: { template_id: string; usage_count: number }) => {
      acc[row.template_id] = row.usage_count
      return acc
    },
    {},
  )

  return NextResponse.json(stats)
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromBearerToken(request.headers.get("authorization"))
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as { template_id?: string }
  if (!body.template_id) {
    return NextResponse.json({ error: "template_id is required" }, { status: 400 })
  }

  await sql`
    INSERT INTO template_usage (template_id, user_id)
    VALUES (${body.template_id}, ${userId})
  `

  return NextResponse.json({ ok: true }, { status: 201 })
}
