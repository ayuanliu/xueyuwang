/*--------------------------------------------------------*/
/*
    body部分
        borderWidth 边框的大小      
*/
let borderWidth = parseInt(getComputedStyle(document.body)['border-width']);
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
/*
    雨滴部分
*/
let rainArr = new Array();
rainArr.num = 0;
let rainSelect = 0;
/*--------------------------------------------------------*/

// 创建雨滴
export function createRain() {
    return setInterval(function () {
        // 创建雨滴
        // 雨滴下落范围
        for (var i = 0; i < 3; i++) {
            var area = Math.round(Math.random() * (document.body.offsetWidth - 2 * borderWidth));
            var rain = document.createElement("div");
            rainSelect = Math.round(Math.random() * 1);
            if (!rainSelect) {
                rain.className = "rain1";
                rain.innerHTML = "<div class='rain-tail1'></div>" +
                    "<div class='rain-top1'></div>";
            } else {
                rain.className = "rain2";
                rain.innerHTML = "<div class='rain-tail2'></div>" +
                    "<div class='rain-top2'></div>";
            }
            rain.style.opacity = Math.random();
            rain.style.left = area + "px";
            document.body.appendChild(rain);
            rainArr[rainArr.num++] = rain;
        }
    }, 200);
}

// 雨滴移动
export function moveRain() {
    for (var i = 0; i < rainArr.length; i++) {
        rainArr[i].style.top = rainArr[i].offsetTop - borderWidth + 10 + "px";
        if (rainArr[i].offsetTop + borderWidth + rainArr[i].offsetHeight > document.body.offsetHeight) {
            document.body.removeChild(rainArr[i]);
            rainArr.splice(i, 1);
            i--;
            rainArr.num--;
        }
    }
}

// 删除雨滴
export function clearRain() {
    for (let i = 0; i < rainArr.length; i++) {
        document.body.removeChild(rainArr[i]);
    }
    rainArr.num = 0;
    rainArr.length = 0;
}