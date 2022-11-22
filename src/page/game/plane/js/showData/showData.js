import { reqGetPacificThunder, reqPacificThunder, reqPostPacificThunder, reqPutPacificThunder } from "../../../../../api/index.js";

let value = 0;
const showData = document.querySelector('.showData');
let score = document.querySelector('.showData .score');
const curWeapon = document.querySelector('.weapon');

export function outInShowData() {
    if (showData.offsetWidth >= 200) {
        move(showData, 'width', 0, 5);
    } else {
        move(showData, 'width', 200, 5);
    }
}

export function addScore(num) {
    num ? value = value + num : null //value++;
    score.innerHTML = value;
}
export function getScore() {
    return value;
}
export function setScore() {
    value = 0;
    score.innerHTML = value;
}
// 上传分数
export function sendScore() {
    // 获取到排行分数
    // 不要使用_sort自己排序然后去修改
    // 注意发送给服务器修改的请求会很晚执行所以先将分数保存一下防止延迟执行过程中数据更改
    const tempValue = value;
    // 发送给用户数据
    reqGetPacificThunder().then(response => {
        let obj = response;
        const data = obj.data;
        // 如果数据库没有数据则post数据
        if (Object.keys(response).length == 0) {
            obj = {
                id: null,
                "token": localStorage.getItem('token'),
                "PacificThunder": true,
                "data": [
                  tempValue,
                  0,
                  0,
                  0,
                  0
                ]
            }
            reqPostPacificThunder(obj);
            return;
        }

        // 将获取到的数据升序
        data.sort(function (a, b) {
            return a - b;
        })
        for (let i = 0; i < data.length; i++) {
            // 玩家获得分数大于数据库中的
            if (tempValue > data[i]) {
                data[i] = tempValue;
                // 发送AJAX请求替换最小的那个数据
                reqPutPacificThunder(obj.id,obj)
                break;
            }
        }
    })
    // 发送给公共的数据
    sendAJAX('GET', '/plane', undefined, function (result) {
        const obj = result 
        // 将获取到的数据降序
        obj.sort(function(a,b){
            return  b.score - a.score;
        })
        for (let i = 0; i < obj.length; i++) {
            // 玩家获得分数大于数据库中的
            if (tempValue > obj[i].score) {
                let uName = localStorage.getItem('token');
                // 发送AJAX请求替换最小的那个数据
                sendAJAX('PUT', `/plane/${obj[obj.length-1].id}`, `id=&uName=${uName.substring(1,uName.length)}&score=${tempValue}`)
                break;
            }
        }
    })
}

// 武器信息
export function updataCurWeapon(key) {
    let result = '';
    switch (key) {
        case 0:
            result = '普通公鸡'
            break;
        case 1:
            result = '回旋蛋';
            break;
    }
    curWeapon.innerHTML = result;
}