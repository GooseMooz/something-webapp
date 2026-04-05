import { type NextRequest, NextResponse } from "next/server"

const SKIP_REQ_HEADERS = new Set(["host", "connection", "transfer-encoding"])

const SKIP_RES_HEADERS = new Set(["connection", "transfer-encoding", "content-encoding", "content-length"])

async function proxy(req: NextRequest, params: { path: string[] }) {
  const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3010"

  const { path } = params
  const url = new URL(req.url)
  const target = `${BACKEND_URL}/${path.join("/")}${url.search}`

  const headers = new Headers()
  req.headers.forEach((value, key) => {
    if (!SKIP_REQ_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value)
    }
  })

  const hasBody = req.method !== "GET" && req.method !== "HEAD"
  const body = hasBody ? await req.arrayBuffer() : undefined

  let response: Response
  try {
    response = await fetch(target, {
      method: req.method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Backend unreachable"
    return NextResponse.json({ error: message }, { status: 502 })
  }

  const responseHeaders = new Headers()

  const setCookies: string[] =
    typeof (response.headers as { getSetCookie?: () => string[] }).getSetCookie === "function"
      ? (response.headers as { getSetCookie: () => string[] }).getSetCookie()
      : []
  for (const cookie of setCookies) {
    const rewritten = cookie.replace(/;\s*Path=[^;]*/i, "; Path=/")
    responseHeaders.append("set-cookie", rewritten)
  }

  response.headers.forEach((value, key) => {
    if (!SKIP_RES_HEADERS.has(key.toLowerCase()) && key.toLowerCase() !== "set-cookie") {
      responseHeaders.set(key, value)
    }
  })

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await params)
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await params)
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await params)
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await params)
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await params)
}
