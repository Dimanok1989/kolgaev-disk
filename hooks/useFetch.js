import { useState } from "react";

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

    let token = localStorage.getItem('token');
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
    }
}