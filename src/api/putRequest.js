import './axios.js'
// axios请求
const putRequest = axios.create({
    baseURL: 'http://127.0.0.1:3000',
    timeout: 2000,
})
putRequest.interceptors.request.use(function (config) {
    let token = localStorage.getItem('token')
    let str = config.url;
    // 带上token本来是放请求头由于没有后台
    if (token) {
        str = `${str}`;
    } else {
        str = `/uuidToken/${str}`
    }
    config.url = str;
    return config;
}, function (error) {
    console.log(error);
    return Promise.reject(error);
})


export default putRequest