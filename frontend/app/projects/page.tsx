"use client"

import { useState, useEffect } from "react"
import type { FormEvent } from "react"
import { useProjectStore } from "@/store/projectStore"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAlert } from "@/lib/alert"

export default function ProjectsPage() {
  const { projects, loading, error, setError, createNewProject, removeProject, fetchProjects } =
    useProjectStore()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const { show } = useAlert()

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleCreate = async () => {
    try {
      await createNewProject({ name, description })
      setSuccess(true)
      await fetchProjects()
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      show("Error creating project", "Failed to create project. Please try again.", "error")
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handleCreate()
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your cartoon production projects
          </p>
        </header>

        {error && (
          <div className="mb-4 p-4 rounded bg-red-100 dark:bg-red-900 text-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 rounded bg-green-100 dark:bg-green-900 text-green-800">
            Project created successfully!
          </div>
        )}

        {/* Project Form */}
        <div className="mb-6 p-4 rounded bg-white dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Create New Project
          </h2>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project description"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="bg-[--primary]/20 text-[--primary] px-4 py-2 rounded hover:bg-[--primary]/30 hover:text-[--foreground]">
                Create Project
              </Button>
              <Button
                onClick={() => router.push("/projects")}
                className="bg-[--muted]/20 text-[--muted] px-4 py-2 rounded hover:bg-[--muted]/30 hover:text-[--foreground]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Projects List */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading && (
            <div className="col-span-full py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Loading projects...</p>
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="col-span-full py-8 text-center text-gray-500 dark:text-gray-400">
              <p>No projects found. Create your first project above.</p>
            </div>
          )}

          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {project.name}
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">{project.description}</p>

              <div className="mt-4 flex gap-2">
                <Button variant="destructive" size="sm" onClick={async () => {
                  if (confirm(`Delete project "${project.name}"?`)) {
                    await removeProject(project.id)
                    await fetchProjects()
                    router.refresh()
                  }
                }}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}