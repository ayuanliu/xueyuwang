/*--------------------------------------------------------*/
/*
    body部分
        bodyBorderWidth 边框的大小      
*/
let bodyBorderWidth = parseInt(getComputedStyle(document.body)['border-width']);
let bodyWidth = parseInt(getComputedStyle(document.body)['width']);
let bodyHeight = parseInt(getComputedStyle(document.body)['height']);
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
/*
    雨滴部分
*/
let rainArr = [];
let freeMap = [];
let rains = [];
let index = 0;
/*--------------------------------------------------------*/
// 创建雨滴
export function createRain() {
    // 创建30个雨滴
    for (let i = 0; i < 30; i++) {
        let type = i % 2 + 1;
        let rain = `
                <div class='rain rain${type}' style="visibility:hidden">
                    <div class='rain-tail${type}'></div>
                    <div class='rain-top${type}'></div>
                </div>
            `
        rainArr.push(rain);
        freeMap[i] = true;
    }
    // 将rainArr中的真实DOM挂载到页面
    document.body.insertAdjacentHTML('beforeend', rainArr.join(''));
    rains = document.querySelectorAll('.rain');
    return rainBegin();
}
function rainBegin() {
    return setInterval(function () {
        if (index >= freeMap.length) index = 0;
        // 查询映射表中当前雨滴是否可用
        if (freeMap[index]) {
            // 可用 将该雨滴移到初始位置
            let area = Math.round(Math.random() * (bodyWidth - 2 * bodyBorderWidth));
            let style = rains[index].style;
            Object.assign(style, {
                top: '0px',
                left: `${area}px`,
                visibility: 'visible',
                opacity: Math.random()
            })
            freeMap[index++] = false;
        }
    }, 100);
}
function rainEnd(i) {
    if (rains[i].offsetTop + bodyBorderWidth + rains[i].offsetHeight > bodyHeight) {
        rains[i].style.visibility = 'hidden';
        freeMap[i] = true;
    }
}
// 雨滴移动
export function moveRain() {
    // 只有不是free的雨滴才能移动
    for (let i = 0; i < freeMap.length; i++) {
        // 只有不处于free状态的雨滴才能移动
        if (!freeMap[i]) {
            rains[i].style.top = rains[i].offsetTop - bodyBorderWidth + 10 + "px";
            // 移动到最后了
            rainEnd(i);
        }
    }
}
// 删除雨滴
export function clearRain() {
    for (let i = 0; i < rains.length; i++) {
        document.body.removeChild(rains[i]);
    }
}