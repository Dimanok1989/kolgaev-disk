import Axios from "axios"; // Импорт библиотеки axios
import Cookies from 'js-cookie'; // Импорт библиотеки аботы с куками

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

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Отслеживание токена
axios.interceptors.request.use(function (config) {

    const token = Cookies.get('token') || localStorage.getItem('token');
    config.headers.common['Authorization'] = token ? `Bearer ${token}` : null;

    if (window.Echo)
        config.headers.common['X-Socket-Id'] = window.Echo.socketId();

    return config;

});

export default axios