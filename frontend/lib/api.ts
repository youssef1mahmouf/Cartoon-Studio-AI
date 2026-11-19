import axios from "axios"

const api = axios.create({
  baseURL: "/api/v1/projects",
  headers: {
    "Content-Type": "application/json",
  },
})

export interface Project {
  id: string
  name: string
  description: string
}

export interface CreateProjectData {
  name: string
  description: string
}

export interface CreateProjectResponse {
  project: Project
}

export interface ApiResponse<T> {
  data: T
  error?: string
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>("")
  return response.data
}

export const createProject = async (data: CreateProjectData): Promise<Project> => {
  const response = await api.post<CreateProjectResponse>("", { project: data })
  return response.data.project
}

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`?id=${id}`)
}