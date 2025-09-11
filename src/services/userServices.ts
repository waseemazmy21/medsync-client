import { handleError } from "@/lib/utils";
import api from "./axios-instance";

export type UserInfoUpdate = {
    id: string;
    role: string
}

export const updateUser = async (user: UserInfoUpdate, updatedData: any) => {

    try {
        const { data } = await api.patch(`/user/${user.role.toLocaleLowerCase()}/${user.id}`, updatedData)

        return data
    } catch (err) {
        throw new Error(handleError(err));
    }
}