import axios, { AxiosRequestConfig, AxiosInstance, AxiosError } from "axios";

declare global {
    interface Window {
        Echo?: any
    }
}

interface Axios extends AxiosInstance {
    getError?: any
    setError?: any
}

const instance: Axios = axios.create({
    baseURL: process.env.REACT_APP_REST_API_URL + '/',
    responseType: "json",
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
});

instance.getError = (error: AxiosError) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
        return error.response?.data?.message || error?.response?.statusText;
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request);
        return "Request error";
    } else {
        // Something happened in setting up the request that triggered an Error
        return error.message;
    }
}

instance.setError = (error: AxiosError, sets: any) => {
    if (typeof sets == "function")
        sets(instance.getError(error));
}

instance.interceptors.request.use((config: AxiosRequestConfig) => {

    const token: string | null = localStorage.getItem('k_access_token');

    config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
        'X-Socket-ID': window.Echo && window.Echo.socketId(),
    }

    return config;

});

export default instance;