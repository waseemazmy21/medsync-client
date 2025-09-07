import { ReviewData } from "@/lib/types";
import api from "./axios-instance";

export async function review(){
    try {
        // const res = api.get("/appointment?status=upcoming&limit=3")
        const res = await api.get("/review")
        console.log("res appointments",res);
        return res.data
        
    } catch (error) {
        console.log("err appointments",error);
        throw new Error("field to fetch appointments")
    }
}

export async function addReview(reviewData: ReviewData){
    try {
        // const res = api.get("/appointment?status=upcoming&limit=3")
        const res = await api.post("/review", reviewData)
        console.log("res review",res);
        return res.data
        
    } catch (error) {
        console.log("err review",error);
        throw new Error("field to review")
    }
}