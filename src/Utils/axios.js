import axios from "axios"; // Импорт библиотеки axios
import Cookies from 'js-cookie'; // Импорт библиотеки аботы с куками

// Заголовки
let headers = {
    'X-Requested-With': 'XMLHttpRequest',
}

// Токен из куков или localStorage
let token = Cookies.get('token') || localStorage.getItem('token');

// Запись токе в заголовок
if (token)
    headers.Authorization = 'Bearer ' + token;

// Настройки axios
export default axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    responseType: "json",
    headers
});