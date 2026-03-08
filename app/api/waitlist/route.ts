import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const WAITLIST_FILE = path.join(DATA_DIR, "waitlist.json")

interface WaitlistEntry {
  email: string
  timestamp: string
}

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch {
    // Directory might already exist
  }
}

async function getWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const data = await fs.readFile(WAITLIST_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveWaitlist(entries: WaitlistEntry[]) {
  await ensureDataDir()
  await fs.writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const waitlist = await getWaitlist()

    // Check for duplicate
    if (waitlist.some((entry) => entry.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ message: "Already on waitlist" }, { status: 200 })
    }

    // Add new entry
    waitlist.push({
      email: email.toLowerCase(),
      timestamp: new Date().toISOString(),
    })

    await saveWaitlist(waitlist)

    return NextResponse.json({ message: "Added to waitlist" }, { status: 200 })
  } catch (error) {
    console.error("Waitlist API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const waitlist = await getWaitlist()
    return NextResponse.json({ count: waitlist.length, entries: waitlist })
  } catch (error) {
    console.error("Waitlist GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
