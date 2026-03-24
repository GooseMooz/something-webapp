import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const FILE = path.join(DATA_DIR, "task-submissions.json")

async function getSubmissions() {
  try {
    const data = await fs.readFile(FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.organization?.name || !body.organization?.email || !body.task?.title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const submissions = await getSubmissions()
    submissions.push({ ...body, submittedAt: new Date().toISOString() })

    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(FILE, JSON.stringify(submissions, null, 2))

    return NextResponse.json({ message: "Task submitted" }, { status: 200 })
  } catch (error) {
    console.error("Task submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
