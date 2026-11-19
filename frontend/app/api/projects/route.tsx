import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

interface Project {
  id: string
  name: string
  description: string
}

// In-memory storage for demo - in production this would be a database
const projects: Project[] = []

export async function GET() {
  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const project: Project = {
    id: crypto.randomUUID(),
    name: body.name,
    description: body.description,
  }
  projects.push(project)
  return NextResponse.json(project, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("id")

  if (!projectId) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
  }

  const index = projects.findIndex((p) => p.id === projectId)

  if (index === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  projects.splice(index, 1)
  return NextResponse.json({ success: true })
}