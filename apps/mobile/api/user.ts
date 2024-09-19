import { UserLight } from "../../common/dto/user-light";
import { api } from "@/api/client";
import axios from "axios";

export const fetchCurrentUser = async (): Promise<UserLight | undefined> => {
    try {
        const response = await api.get<UserLight>("/users/me");
        return response.data as UserLight;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Erreur Axios :', error.response?.data);
        } else {
            console.error('Erreur inattendue :', error);
        }
        return undefined; 
    }
};