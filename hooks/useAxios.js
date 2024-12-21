import Axios from "axios";
import { getCookie } from "./useCookies";

export default function useAxios() {

    let headers = {
        'Accept': "application/json",
        'X-Requested-With': "XMLHttpRequest",
        'X-Application-Id': process.env.NEXT_PUBLIC_APP_KEY,
    };

    const axios = Axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_SERVER,
        headers,
    });

    axios.interceptors.request.use((config) => {

        const token = getCookie('kolgaev_api_token') || localStorage.getItem('kolgaev_api_token');
    
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`
        }
    
        return config;
    
    });

    return {
        axios,
        get: async (url, params) => axios.get(url, params),
    };
}

