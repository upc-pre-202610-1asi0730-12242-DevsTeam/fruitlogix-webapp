import axios from 'axios';

export class BaseApi {
    constructor() {
        this.http = axios.create({
            baseURL: 'https://fruitlogix-platform.onrender.com/api/v1',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        this.http.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }
}