import axios from "axios"; // Импорт библиотеки axios
import Cookies from 'js-cookie'; // Импорт библиотеки аботы с куками

// Базовые настройки axios
let instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    responseType: "json",
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Отслеживание токена
instance.interceptors.request.use(function (config) {

    const token = Cookies.get('token') || localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : null;

    return config;

});

export default instance