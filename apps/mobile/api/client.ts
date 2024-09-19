import axios, { type AxiosError, isAxiosError } from "axios";
import { AccessTokenResponse } from "../../common/dto/access-token-response";
import AsyncStorage from '@react-native-async-storage/async-storage';
import createAuthRefreshInterceptor from "axios-auth-refresh";

export const api = axios.create({
    baseURL: 'http://10.0.2.2:3000',
    headers: {
        'Content-Type': 'application/json',
        'access-control-allow-origin': '*'
    },
});

async function refreshAccessToken(failedRequest: AxiosError) {
    try {
        const storedRefreshToken = await AsyncStorage.getItem("refresh_token");
        if (!storedRefreshToken) {
            throw new Error("Refresh token not found");
        }

        const response = await api.post<AccessTokenResponse>("/auth/refresh", { refreshToken: storedRefreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (failedRequest.response) {
            failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;
        }

        await AsyncStorage.setItem("access_token", accessToken);
        await AsyncStorage.setItem("refresh_token", newRefreshToken);
        setClientAccessToken(accessToken);

        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}

createAuthRefreshInterceptor(api, refreshAccessToken, {
    statusCodes: [401],
    shouldRefresh: isTokenExpiredError,
    pauseInstanceWhileRefreshing: true,
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export function setClientAccessToken(accessToken: string) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

export function isTokenExpiredError(error: AxiosError): boolean {
    if (!isAxiosError(error)) return false;
    if (!error.response) return false;
    return error.response.status === 401 && error.response.data === "TokenExpired";
}