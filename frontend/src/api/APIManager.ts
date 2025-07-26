import axios from 'axios';
import { urlBase } from './APIs';
import { routeAuth, routeMaintenance } from '../utils/Routes';

export interface ApiResult<T = any> {
    data?: T;
    error: string;
}

const axiosInstance = axios.create({
    baseURL: urlBase,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

function checkToken(errorMessage: string, status: number) {
    const msg = errorMessage.toString();
    const currentPath = window.location.pathname;

    if ((msg === 'Token Invalid' || msg == 'Token Required' || status === 401) && !currentPath.startsWith(routeAuth)) {
        window.location.replace(routeAuth);
    }
}

function checkServer(errorMessage: string) {
    const msg = errorMessage.toString();
    const currentPath = window.location.pathname;

    if ((msg === 'net::ERR_CONNECTION_REFUSED' || msg === 'Network Error') && !currentPath.startsWith(routeMaintenance)) {
        window.location.replace(routeMaintenance);
    }
}

const handleRequest = async <T>(promise: Promise<{ data: T }>): Promise<ApiResult<T>> => {
    try {
        const response = await promise;
        return { data: response.data, error: '' };
    } catch (error: any) {
        const isTimeout = error.code === 'ECONNABORTED';
        const errorMessage = isTimeout ? 'Request timed out, please try again.' : error.response?.data || error.message || 'Unknown error';
        checkServer(errorMessage);
        checkToken(errorMessage, error.status);
        return { error: errorMessage };
    }
};

export const getRequest = <T>(url: string) => handleRequest<T>(axiosInstance.get(url));
export const postRequest = <T>(url: string, body?: any) => handleRequest<T>(axiosInstance.post(url, body));
export const putRequest = <T>(url: string, body?: any) => handleRequest<T>(axiosInstance.put(url, body));
export const deleteRequest = <T>(url: string, body?: any) => handleRequest<T>(axiosInstance.delete(url, { data: body }));