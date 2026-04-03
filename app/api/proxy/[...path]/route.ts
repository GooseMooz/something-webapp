import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL environment variable is not set")
}

const SKIP_REQ_HEADERS = new Set(["host", "connection", "transfer-encoding"])

const SKIP_RES_HEADERS = new Set(["connection", "transfer-encoding", "content-encoding", "content-length"])

async function proxy(req: NextRequest, params: { path: string[] }) {
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

  const response = await fetch(target, {
    method: req.method,
    headers,
    body: hasBody ? req.body : undefined,
    // @ts-expect-error — Node 18+ supports this, prevents buffering
    duplex: "half",
  })

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
