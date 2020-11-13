import Axios from "axios"; // Импорт библиотеки axios
import Cookies from 'js-cookie'; // Импорт библиотеки аботы с куками

// Базовые настройки axios
const axios = Axios.create({
    baseURL: process.env.REACT_APP_API_URL,
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

    if (window.socketId)
        config.headers.common['Socket-Id'] = window.socketId;

    return config;

});

export default axios