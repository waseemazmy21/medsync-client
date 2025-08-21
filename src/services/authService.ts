import { BloodType, Gender } from "@/lib/types"
import api from "./axios-instance"

export type loginData = {
    email: string,
    passowrd: string
}

export const login = async (loginData: loginData) => {
    try{
        const {data} = await api.post('/auth/login', loginData)        
        localStorage.setItem("token", data.data.accessToken);
        return data
    } catch(err){
        console.log("Error from login fun", err);
        throw new Error(err?.message || "Invalide Server Error")
    }
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

export const register = async (registerData:registerData ) => {
    try {
        console.log("registerData register",registerData);
        const {data} = await api.post('/auth/register', registerData)
        localStorage.setItem("token", data.data.accessToken);
        return data

    } catch (error) {
        console.log("Error from register fun", error);
        throw new Error(error?.response.data.message || "Invalide Server Error")
    }
}