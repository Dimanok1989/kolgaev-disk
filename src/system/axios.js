import Axios from "axios";
import Cookies from 'js-cookie';

let baseUrl = process.env.REACT_APP_API_PROTOCOL + "://" + process.env.REACT_APP_API_HOST;

if (process.env.REACT_APP_API_PREFIX)
    baseUrl += "/" + process.env.REACT_APP_API_PREFIX + "/";

// Базовые настройки axios
const axios = Axios.create({
    baseURL: baseUrl,
    responseType: "json",
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
});

/**
 * Получение текста ошибки
 * @param {any} error 
 * @returns {string}
 */
axios.getError = error => error?.response?.data?.message
? error?.response?.data?.message
: error?.response?.statusText
    ? error?.response?.statusText
    : "Неизвестная ошибка";

// Отслеживание токена
axios.interceptors.request.use(function (config) {

    const token = Cookies.get('token') || localStorage.getItem('token');
    config.headers.common['Authorization'] = token ? `Bearer ${token}` : null;

    if (window.Echo)
        config.headers.common['X-Socket-Id'] = window.Echo.socketId();

    return config;

});

export default axios