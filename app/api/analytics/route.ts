import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { getUserIdFromBearerToken } from "@/lib/server-auth"

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromBearerToken(request.headers.get("authorization"))
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as {
    event_name?: string
    template_id?: string | null
    metadata?: Record<string, any>
  }

  if (!body.event_name) {
    return NextResponse.json({ error: "event_name is required" }, { status: 400 })
  }

  await sql`
    CREATE TABLE IF NOT EXISTS public.analytics_events (
      id bigserial PRIMARY KEY,
      user_id uuid NOT NULL,
      event_name varchar(100) NOT NULL,
      template_id varchar(100),
      metadata jsonb DEFAULT '{}'::jsonb,
      created_at timestamptz DEFAULT now()
    )
  `

  await sql`
    INSERT INTO public.analytics_events (user_id, event_name, template_id, metadata)
    VALUES (${userId}, ${body.event_name}, ${body.template_id ?? null}, ${JSON.stringify(body.metadata ?? {})}::jsonb)
  `

  return NextResponse.json({ ok: true }, { status: 201 })
}
