import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function POST() {
  const filePath = path.join(process.cwd(), 'data', 'waitlist.json')
  let emails: string[] = []
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const entries: { email: string }[] = JSON.parse(raw)
    emails = entries.map((e) => e.email)
  } catch {
    return NextResponse.json({ error: 'Could not read waitlist' }, { status: 500 })
  }

  if (emails.length === 0) {
    return NextResponse.json({ error: 'Waitlist is empty' }, { status: 400 })
  }

  const apiKey = process.env.CAMPAIGN_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'CAMPAIGN_API_KEY is not configured' }, { status: 500 })
  }

  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3010'

  let response: Response
  try {
    response = await fetch(`${backendUrl}/campaigns/launch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Campaign-API-Key': apiKey,
      },
      body: JSON.stringify({ emails }),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Backend unreachable'
    return NextResponse.json({ error: message }, { status: 502 })
  }

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
