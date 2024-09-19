import {RegisterRequest} from "../../../common/dto/register-request"
import {LoginRequest} from "../../../common/dto/login-request"
import {createContext} from "react";
import { AxiosResponse } from "axios";

export interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    register: (credentials: RegisterRequest) => Promise<AxiosResponse>;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined)