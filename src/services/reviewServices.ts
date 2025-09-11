import { ReviewData } from "@/lib/types";
import api from "./axios-instance";

export async function review(){
    try {
        // const res = api.get("/appointment?status=upcoming&limit=3")
        const res = await api.get("/review")
        return res.data
        
    } catch (error) {
        throw new Error("field to fetch appointments")
    }
}

export async function addReview(reviewData: ReviewData){
    try {
        // const res = api.get("/appointment?status=upcoming&limit=3")
        const res = await api.post("/review", reviewData)
        return res.data
        
    } catch (error) {
        throw new Error("field to review")
    }
}