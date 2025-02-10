import axios from 'axios';

const api = axios.create({
    // this is the url of the server
    baseURL: 'http://127.0.0.1:8000'
});

// we can now use api as the endpoint
export default api;