import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

interface Project {
  id: string
  name: string
  description: string
}

// In-memory storage for demo - in production this would be a database
const projects: Project[] = []

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id
  const index = projects.findIndex((p) => p.id === projectId)
  
  if (index === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }
  
  projects.splice(index, 1)
  return NextResponse.json({ success: true })
}