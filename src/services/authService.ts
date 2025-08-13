import api from "./axios-instance"

type loginData = {
    email: string,
    passowrd: string
}

export const login = async (loginData: loginData) => {
    const res = api.post('/auth/login', loginData)
    return res
}

export const register = async () => {
    const res = api.post('/auth/login')
    return res
}