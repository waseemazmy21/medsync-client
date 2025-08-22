import api from "./axios-instance";

export async function appointments(){
    try {
        // const res = api.get("/appointment?status=upcoming&limit=3")
        const res = await api.get("/appointment")
        console.log("res appointments",res);
        return res.data
        
    } catch (error) {
        console.log("err appointments",error);
        throw new Error("field to fetch appointments")
    }
}