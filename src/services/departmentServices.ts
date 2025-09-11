import api from "./axios-instance";

export async function departments(){
    try {
        const res = await api.get("/department")
        return res.data
        
    } catch (error) {
        throw new Error("field to fetch departments")
    }
}