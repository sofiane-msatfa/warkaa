import {RegisterRequest} from "../../../common/dto/register-request"
import {LoginRequest} from "../../../common/dto/login-request"
import {useEffect, useMemo, useState} from "react";
import {api, setClientAccessToken} from "@/api/client";
import {AccessTokenResponse} from "../../../common/dto/access-token-response";
import {AuthContext, type AuthContextType} from "./auth-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";


interface AuthProviderProps {
    children: React.ReactNode
}

export function AuthContextProvider({children}: AuthProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(null)


    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await AsyncStorage.getItem("access_token");
                setAccessToken(token);
                if (token) {
                    setClientAccessToken(token);
                }
            } catch (error) {
                console.error("Erreur lors du chargement du token:", error);
            }
        };

        loadToken();
    }, [accessToken]);

    // useEffect(() => {
    //     if (accessToken) {
    //         // TODO CREATE CLIENT ACCESS TOKEN
    //         setClientAccessToken(accessToken)
    //     }
    // }, [accessToken])

    const register = async (credentials: RegisterRequest) => {
        await api.post('http://10.0.2.2:3000/auth/register', credentials)
    }
    const login = async (credentials: LoginRequest) => {
        try {
            const response = await api.post<AccessTokenResponse>('http://10.0.2.2:3000/auth/login/', credentials);
            const {accessToken} = response.data
            console.log('accessToken : ', accessToken)
            AsyncStorage.setItem('access_token', accessToken)
            setAccessToken(accessToken)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Erreur Axios :', error.response?.data);
            } else {
                console.error('Erreur inattendue :', error);
            }
        }

    }

    const logout = async () => {
        await api.post('/auth/logout')
        AsyncStorage.removeItem('access_token')
        setAccessToken(null)
    }

    const value: AuthContextType = useMemo(
        () => ({
            isAuthenticated: !!accessToken,
            accessToken,
            register,
            login,
            logout,
        }),
        [accessToken, register, login, logout],
    );
    console.log(children);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}