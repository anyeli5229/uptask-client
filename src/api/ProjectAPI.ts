
import { isAxiosError } from "axios"
import api from "../db/axios"
import { dashboardProjectSchema, editProjectSchema, Project, ProjectFormData, projectSchema } from "../types"

export async function createProjec(formData : ProjectFormData) {
    try {
        const { data } = await api.post("/projects", formData)
        return(data)
    } catch (error) {
        if(isAxiosError(error) && error.message) { //Condiciones para que error no sea undefined
            throw new Error(error.response?.data.error)
        }
    }
}

export async function getProjects() {
    try {
        const { data } = await api("/projects")
        const response = dashboardProjectSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.message) {
            throw new Error(error.response?.data.error)
        }
    }
}

export async function getProjectById(id : Project['_id']) {
    try {
        const { data } = await api(`/projects/${id}`)
        const response = editProjectSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.message) {
            throw new Error(error.response?.data.error)
        }
    }
}

export async function getFullProjectDetails(id : Project['_id']) {
    try {
        const { data } = await api(`/projects/${id}`)
        const response = projectSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.message) {
            throw new Error(error.response?.data.error)
        }
    }
}

type ProjectAPIType = {
    projectId : Project['_id'],
    formData: ProjectFormData
}
export async function updateProject({projectId, formData} : ProjectAPIType) {
    try {
        const { data } = await api.put<string>(`/projects/${projectId}`, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.message) {
            throw new Error(error.response?.data.error)
        }
    }
}

export async function deleteProject(id : Project['_id']) {
    try {
        const { data } = await api.delete<string>(`/projects/${id}`)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.message) {
            throw new Error(error.response?.data.error)
        }
    }
}