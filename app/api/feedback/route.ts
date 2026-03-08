import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json")

interface FeedbackEntry {
  id: string
  message: string
  timestamp: string
}

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch {
    // Directory might already exist
  }
}

async function getFeedback(): Promise<FeedbackEntry[]> {
  try {
    const data = await fs.readFile(FEEDBACK_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveFeedback(entries: FeedbackEntry[]) {
  await ensureDataDir()
  await fs.writeFile(FEEDBACK_FILE, JSON.stringify(entries, null, 2))
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const trimmedMessage = message.trim()
    if (trimmedMessage.length === 0) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 })
    }

    if (trimmedMessage.length > 5000) {
      return NextResponse.json({ error: "Message too long (max 5000 characters)" }, { status: 400 })
    }

    const feedback = await getFeedback()

    // Add new entry
    feedback.push({
      id: generateId(),
      message: trimmedMessage,
      timestamp: new Date().toISOString(),
    })

    await saveFeedback(feedback)

    return NextResponse.json({ message: "Feedback received" }, { status: 200 })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const feedback = await getFeedback()
    return NextResponse.json({ count: feedback.length, entries: feedback })
  } catch (error) {
    console.error("Feedback GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
