import api from "./axios-instance"

export async function reports(departmentID: string) {
    const { data } = await api.get(`/reports/departments/${departmentID}`)
    return data
}

export async function generateReport(departmentID: string) {
    const data = await api.get(`/reports/departments/${departmentID}/generate`)
    return data
}