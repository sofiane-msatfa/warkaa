import {UserLight} from "../../common/dto/user-light"
import {api} from "@/api/client";
import {AccessTokenResponse} from "../../common/dto/access-token-response";
import axios from "axios";

export const fetchCurrentUser = async () => {
    try {
        const response = await api.get<UserLight>("/users/me")
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Erreur Axios :', error.response?.data);
        } else {
            console.error('Erreur inattendue :', error);
        }
    }

}