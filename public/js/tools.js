// 获取元素CSS样式
function getStyle(obj, name) {
    // window因为属性名没找到不会报错
    if (window.getComputedStyle) {
        return getComputedStyle(obj, null)[name];
    }
    else {
        // 兼容IE8
        return obj.currentStyle[name];
    }
}

// 设计动画原理就是每个多少毫秒加x
    /* 
        obj: 要改变样式的元素
        attr: 要改变的样式
        target: 改变的最终结果
        speed: 改变的速度
        callback: 回调函数
    */
function move(obj, attr, target, speed, callback) {
    // 先停止当前的动画

    clearInterval(obj.timer);
    var current = parseInt(getStyle(obj, attr));
    if (current > target) {
        speed = -speed;
    }
    obj.timer = setInterval(function () {
        var oldValue = parseInt(getStyle(obj, attr));
        var newValue = oldValue + speed;
        if (speed < 0 && newValue < target || speed > 0 && newValue > target) {
            newValue = target;
        }
        obj.style[attr] = newValue + "px";
        if (newValue == target) {
            clearInterval(obj.timer);
            callback && callback();
        }
    }, 15);

}


/* 为对象添加一个事件 */
function bind(obj, eventStr, callback) {
    if (obj.addEventListener) {
        obj.addEventListener(eventStr, callback, false);
    } else {
        obj.attachEvent("on" + eventStr, function () {
            callback.call(obj);
        });
    }

}


// 将数据分割例如<html></html>分割为html与/html并存入数组
/*  
    参数:
        data 为要分割的数组
        start 开始分割的符号
        end 结束分割的符号
*/
function mySplit(data,start,end){
    var flag = 0;
    var tempArr = new Array();
    var tempIndex = 0;
    for(let i = 0; i < data.length; i++){
        if(data[i] == end && flag == 1){
            flag = 0
            tempIndex++;
        }
        if(flag){
            tempArr[tempIndex] += data[i];
        } 
        if(data[i] == start){
            flag = 1;
            tempArr[tempIndex] = '';
        }
    }
    return tempArr;
}

