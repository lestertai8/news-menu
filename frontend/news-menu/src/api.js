import axios from 'axios';

const api = axios.create({
    // this is the url of the server
    baseURL: 'http://127.0.0.1:8000'
    // baseURL: 'https://news-menu.onrender.com'
});

// we can now use api as the endpoint
export default api;