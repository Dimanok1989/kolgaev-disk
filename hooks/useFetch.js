import { useState } from "react";
import { getCookie } from "./useCookies";

export const baseUrl = process.env.NEXT_PUBLIC_API_SERVER;

const getUrl = (path, data = null) => {
    if (String(path).toLowerCase().startsWith("http")) {
        return setQueryParams(path, data);
    } else if (!String(path).toLowerCase().startsWith("/")) {
        path = "/" + path;
    }
    return setQueryParams(`${baseUrl ?? window.location.origin}${path}`, data);
}

const setQueryParams = (path, params) => {

    const url = new URL(path);
    const query = new URLSearchParams(url.search);

    if (typeof params == "object" && !(params instanceof URLSearchParams)) {
        for (let key in params) {
            query.append(key, params[key]);
        }
    }

    return `${url.origin}${url.pathname}?${query.toString()}`;
}

const options = (method, body) => {

    let headers = {
        'Accept': "application/json",
        'X-Requested-With': "XMLHttpRequest",
        'X-Application-Id': process.env.NEXT_PUBLIC_APP_KEY,
    };

    let token = getCookie('kolgaev_api_token') || localStorage.getItem('kolgaev_api_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (typeof body == "object" && !(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
    }

    return method === "GET"
        ? { method, headers }
        : { method, headers, body };
}

export const get = (path, params) => fetch(
    getUrl(path, params),
    options("GET")
);

export const post = (path, body) => fetch(
    getUrl(path),
    options("POST", body)
);

/**
* Обработка ошибок
* 
* @param {object} error Объект ошибки
* @param {string} type Тип данных на вывод
* @param {function|null} Отладочная функция
* @returns
*/
export const getError = (error, type = "message", callback = null) => {

    const response = {}

    if (error.response) {

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        response.message = error.response?.data?.message || error.response.statusText;
        response.data = error.response.data;
        response.status = error.response.status;
        response.statusText = error.response.statusText;
        response.headers = error.response.headers;

        if (typeof callback == "function")
            callback(error.response);

    } else if (error.request) {

        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the 
        // browser and an instance of
        // http.ClientRequest in node.js

        response.message = error.request?.data?.message || "Неизвестная ошибка";

        if (typeof callback == "function")
            callback(error.request);

    } else {

        // Something happened in setting up the request that triggered an Error

        response.message = error.message;

        if (typeof callback == "function")
            callback('Error ' + error.message);

    }

    if (typeof callback == "function")
        callback(error.config);

    return response[type] || null;

}

export default function useFetch(props = {}) {

    const { setData } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const postJson = async (path, body, success = null, fail = null) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await post(path, body);
            const data = await response.json();
            if (!response.ok) {
                if (typeof data == "object" && data?.errors) {
                    setErrors(data.errors);
                }
                throw new Error(data?.message || "Запрос не выполнен");
            }
            setError(null);
            setErrors({});
            typeof success == "function" && success(data);
            typeof setData == "function" && setData(data);
            return data;
        } catch (err) {
            typeof fail == "function" && fail(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    const getJson = async (path, body, success = null, fail = null) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await get(path, body);
            const data = await response.json();
            if (!response.ok) {
                if (typeof data == "object" && data?.errors) {
                    setErrors(data.errors);
                }
                throw new Error(data?.message || "Запрос не выполнен");
            }
            setError(null);
            setErrors({});
            typeof success == "function" && success(data);
            typeof setData == "function" && setData(data);
            return data;
        } catch (err) {
            typeof fail == "function" && fail(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        error,
        isError: Boolean(error),
        errors,
        get,
        post,
        postJson,
        getJson,
        getError,
    }
}