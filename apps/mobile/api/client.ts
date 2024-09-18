import axios, {type AxiosError, isAxiosError} from "axios";
import {AccessTokenResponse} from "../../common/dto/access-token-response";
import AsyncStorage from '@react-native-async-storage/async-storage';
import createAuthRefreshInterceptor from "axios-auth-refresh";

export const api = axios.create({
    baseURL: 'http://10.0.2.2:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'access-control-allow-origin': '*'
    },


})


async function refreshAccessToken(failedRequest: AxiosError) {
    try {
        const response = await api.post<AccessTokenResponse>("/auth/refresh");
        const { accessToken } = response.data;

        if (failedRequest.response) {
            failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;
        }

        AsyncStorage.setItem("access_token", accessToken);
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

export function setClientAccessToken(accessToken: string) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

export function isTokenExpiredError(error: AxiosError): boolean {
    if (!isAxiosError(error)) return false;
    if (!error.response) return false;
    // TODO: un peu moche d'écrire en dur le message d'erreur
    return error.response.status === 401 && error.response.data === "Token expired";
}