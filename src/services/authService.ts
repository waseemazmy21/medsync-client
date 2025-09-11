import { BloodType, Gender } from "@/lib/types"
import api from "./axios-instance"
import { handleError } from "@/lib/utils"

export type loginData = {
    email: string,
    passowrd: string
}

export const login = async (loginData: loginData) => {
    const { data } = await api.post('/auth/login', loginData)
    localStorage.setItem("token", data.data.accessToken);
    return data
}


export type registerData = {
    name: string,
    email: string,
    phone: string,
    passowrd: string,
    gender: Gender,
    birthDate: Date,
    bloodType?: BloodType,
    allergies?: string
}

export const register = async (registerData: registerData) => {

    const { data } = await api.post('/auth/register', registerData)
    localStorage.setItem("token", data.data.accessToken);
    return data

}

export const getUser = async () => {
    const { data } = await api.get('/auth/me')
    return data
}