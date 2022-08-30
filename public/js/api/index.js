import requests from './request.js'

export const reqhomeInit = ()=>{
    return requests.get('/plane');
}

// reqlogin().then(response=>{
//     console.log(response);
// });