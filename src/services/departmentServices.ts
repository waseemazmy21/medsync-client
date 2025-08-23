import api from "./axios-instance";

export async function departments(){
    try {
        const res = await api.get("/department")
        console.log("res departments",res);
        return res.data
        
    } catch (error) {
        console.log("err departments",error);
        throw new Error("field to fetch departments")
    }
}