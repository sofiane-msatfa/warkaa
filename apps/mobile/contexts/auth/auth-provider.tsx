import { RegisterRequest } from "../../../common/dto/register-request";
import { LoginRequest } from "../../../common/dto/login-request";
import { useEffect, useMemo, useState, useCallback } from "react";
import { api, setClientAccessToken } from "@/api/client";
import { AccessTokenResponse } from "../../../common/dto/access-token-response";
import { AuthContext, type AuthContextType } from "./auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthContextProvider({ children }: AuthProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTokens = async () => {
            try {
                const [storedAccessToken, storedRefreshToken] = await Promise.all([
                    AsyncStorage.getItem("access_token"),
                    AsyncStorage.getItem("refresh_token")
                ]);
                if (storedAccessToken) {
                    setAccessToken(storedAccessToken);
                    setClientAccessToken(storedAccessToken);
                }
                if (storedRefreshToken) {
                    setRefreshToken(storedRefreshToken);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des tokens:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTokens();
    }, []);

    // Fonction pour l'enregistrement
    const register = useCallback(
        async (credentials: RegisterRequest): Promise<AxiosResponse<any, any>> => {
            return await api.post('/auth/register', credentials);
        },
        []
    );

    // Fonction pour le login
    const login = useCallback(
        async (credentials: LoginRequest) => {
            try {
                const response = await api.post<AccessTokenResponse>("/auth/login/", credentials);
                const { accessToken, refreshToken } = response.data;

                await AsyncStorage.setItem("access_token", accessToken);
                await AsyncStorage.setItem("refresh_token", refreshToken);
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                setClientAccessToken(accessToken);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Erreur Axios :", error.response?.data);
                } else {
                    console.error("Erreur inattendue :", error);
                }
            }
        },
        []
    );

    const logout = useCallback(async () => {
        try {
            const storedRefreshToken = await AsyncStorage.getItem("refresh_token");
            if (storedRefreshToken) {
                await api.post("/auth/logout", { refreshToken: storedRefreshToken });
            }
            await AsyncStorage.removeItem("access_token");
            await AsyncStorage.removeItem("refresh_token");
            setAccessToken(null);
            setRefreshToken(null);
            setClientAccessToken('');
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    }, []);


    // Utiliser useMemo pour éviter de recréer l'objet à chaque re-rendu
    const value: AuthContextType = useMemo(
        () => ({
            isAuthenticated: !!accessToken,
            accessToken,
            register,
            login,
            logout,
            isLoading
        }),
        [accessToken, register, login, logout, isLoading]
    );

    // Ne pas rendre les enfants tant que le token est en cours de chargement
    if (isLoading) {
        return null; // Ou un loader si nécessaire
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
