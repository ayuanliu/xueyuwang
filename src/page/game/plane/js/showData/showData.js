let value = 0;
const showData = document.querySelector('.showData');
let score = document.querySelector('.showData .score');
const curWeapon = document.querySelector('.weapon');

export function outInShowData(){
    if(showData.offsetWidth >= 200){
        move(showData,'width',0,5);
    }else{
        move(showData,'width',200,5);
    }
}

export function addScore(num) {
    num?value=value+num:value++;
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
    sendAJAX('GET', '/plane', undefined, function (result) {
        // const arr = JSON.parse(result.data);
        const arr = result 
        // 将获取到的数据降序
        arr.sort(function(a,b){
            return  b.score - a.score;
        })
        for (let i = 0; i < arr.length; i++) {
            // 玩家获得分数大于数据库中的
            if (tempValue > arr[i].score) {
                console.log(arr.length-1);
                // 发送AJAX请求替换最小的那个数据
                sendAJAX('PUT', `/plane/${arr[arr.length-1].id}`, `id=&score=${tempValue}`)
                break;
            }
        }
    })
}

// 武器信息
export function updataCurWeapon(key){
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