import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.redirect(new URL("/login", request.url))
}
