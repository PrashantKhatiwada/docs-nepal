import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  // Neon Auth handles session cookies directly. This callback route remains for compatibility.
  return NextResponse.redirect(`${requestUrl.origin}/templates`)
}
