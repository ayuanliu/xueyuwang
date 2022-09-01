import './axios.js'
// axios请求
const request = axios.create({
    baseURL: 'http://127.0.0.1:3000',
    timeout: 2000,
})
request.interceptors.request.use(function (config) {
    let token = localStorage.getItem('token')
    let str = config.url;
    // 带上token本来是放请求头由于没有后台
    if (token) {
        str = `/token?token=${token}&${str.substring(1, str.length)}=true`;
    } else {
        str = `/uuidToken?${str.substring(1, str.length)}=true`
    }
    config.url = str;
    return config;
}, function (error) {
    console.log(error);
    return Promise.reject(error);
})
request.interceptors.response.use(function (response) {
    if(response.data[0]==undefined){
        return [];
    }
    return response.data[0].data
})

export default request