import { loginData, registerData } from "@/lib/types"
import api from "./axios-instance"



export const login = async (loginData: loginData) => {
    const { data } = await api.post('/auth/login', loginData)
    localStorage.setItem("token", data.data.accessToken);
    return data
}


export const register = async (registerData: registerData) => {
    const { data } = await api.post('/auth/register', {
        ...registerData,
        allergies: registerData.allergies !== undefined
            ? registerData.allergies.split(",").map((a: string) => a.trim())
            : undefined,
    })
    localStorage.setItem("token", data.data.accessToken);
    return data

}

export const getUser = async () => {
    const { data } = await api.get('/auth/me')
    return data
}