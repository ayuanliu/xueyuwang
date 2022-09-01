import getRequest from './getRequest.js'
import postRequest from './postRequest.js';
import putRequest from './putRequest.js';
import requests from './request.js'


// 带有token的get请求(只获取data部分)
export const reqAvatar = () => {
    return requests.get('/avatar');
}

export const reqPacificThunder = () => {
    return requests.get('/PacificThunder');
}

export const reqGreegySnake = ()=>{
    return requests.get('/GreedySnake');
}
// 带有token的get请求(包扩所有的数据)
export const reqGetAvatat = ()=>{
    return getRequest.get('/avatar');
}
export const reqGetPacificThunder = ()=>{
    return getRequest.get('/PacificThunder')
}
// 带有token的put请求
export const reqPutPacificThunder = (id,data)=>{
    return putRequest.put(`/token/${id}`,data)
}
export const reqPutAvatar = (id,data)=>{
    return putRequest.put(`/token/${id}`,data)
}
// 带有token的post请求
export const reqPostAvatar = (data)=>{
    return postRequest.post('/token',data)
}
export const reqPostPacificThunder = (data)=>{
    return postRequest.post('/token',data)
}