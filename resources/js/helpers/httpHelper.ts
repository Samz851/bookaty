// import axios from 'axios';
import { removeCookie } from '@/helpers/session';
import { loadState } from '@/helpers/localStorage';

(window as any).axios.interceptors.request.use(async function (config) {
    const token = loadState("api-token");
    if(token) {
        config.headers["Authorization"] = 'bearer ' + token.token;
    } else {
        delete config.headers["Authorization"];
        delete config.headers['X-XSRF-TOKEN'];
    }
  
    return config;
},
(error) => {
    return Promise.reject(error);
});

export const clearAuthHeader = () => {
    removeCookie('XSRF-TOKEN');
    removeCookie('requestan_session');
}

export const Request = async (method: string, url: string, data: any = null, headers: any = null) => {
    let result;
    switch (method) {
        case "GET":
            result = await (window as any).axios.get(url, headers);
            break;
        case "POST":
            result = await (window as any).axios.post(url, data, headers);
            break;
    }
    return result;
}

