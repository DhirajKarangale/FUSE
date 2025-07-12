import axios from 'axios';
import { urlBase } from './APIs';

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

const handleRequest = async <T>(promise: Promise<{ data: T }>): Promise<ApiResult<T>> => {
    try {
        const response = await promise;
        return { data: response.data, error: '' };
    } catch (error: any) {
        const isTimeout = error.code === 'ECONNABORTED';
        const errorMessage = isTimeout ? 'Request timed out, please try again.' : error.response?.data || error.message || 'Unknown error';
        return { error: errorMessage };
    }
};

export const getRequest = <T>(url: string) => handleRequest<T>(axiosInstance.get(url));
export const postRequest = <T>(url: string, body?: any) => handleRequest<T>(axiosInstance.post(url, body));
export const putRequest = <T>(url: string, body?: any) => handleRequest<T>(axiosInstance.put(url, body));
export const deleteRequest = <T>(url: string, body?: any) => handleRequest<T>(axiosInstance.delete(url, { data: body }));