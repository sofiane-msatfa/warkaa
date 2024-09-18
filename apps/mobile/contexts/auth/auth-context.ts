import {RegisterRequest} from "../../../common/dto/register-request"
import {LoginRequest} from "../../../common/dto/login-request"
import {createContext} from "react";

export interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    register: (credentials: RegisterRequest) => Promise<void>;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined)