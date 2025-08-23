import api from "./axios-instance";

export type UserInfoUpdate = {
    id:string;
    role:string
}

export const updateUser = async (user:UserInfoUpdate , updatedData) => {
    console.log("updateUser",user);
    
    try{
        const {data} = await  api.patch(`/user/${user.role.toLocaleLowerCase()}/${user.id}`, updatedData)        
        console.log("res updateUser fun",data);
        
        return data
    } catch(err){
        console.log("Error from updateUser fun", err);
        throw new Error(err?.message || "Invalide Server Error")
    }
}