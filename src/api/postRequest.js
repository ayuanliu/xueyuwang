import './axios.js'
// axios请求
const postRequest = axios.create({
    baseURL: 'http://127.0.0.1:3000',
    timeout: 2000,
})
postRequest.interceptors.request.use(function (config) {
    let str = config.url;
    str = `${str}`;
    config.url = str;
    return config;
}, function (error) {
    console.log(error);
    return Promise.reject(error);
})


export default postRequest