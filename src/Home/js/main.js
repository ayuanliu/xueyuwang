window.onload = function () {
    document.body.style.zoom = 0.8;

    userBtn();
    admine();

    // 网页最佳位置
    // 当页面移到某个位置时则需要滚轮滚动很长距离才能继续移动
    document.onwheel = function(event){
        event.preventDefault();
    }


    // 在这制作游戏轮播图
    var gameList = document.getElementById('gameList');
    var gameArr = gameList.children;
    var distance = gameList.offsetWidth / gameArr.length;
    autoChange();
    function autoChange() {
        let index = 0;
        setInterval(function () {
            index++;  
            move(gameList,'left',-index*distance,10,function(){
                if(index >= gameArr.length - 1){
                    index = 0;
                    gameList.style['left'] = 0;
                }
            });
            
        }, 5000);
    }
}




// /* 
//     obj: 要改变样式的元素
//     attr: 要改变的样式
//     target: 改变的最终结果
//     speed: 改变的速度
//     callback: 回调函数
// */
// function move(obj, attr, target, speed, callback) {
//     clearInterval(obj.timer)        //没有则会返回undefined
//     // 判断speed的正负
//     var current = parseInt(getStyle(obj,attr));
//     if(current > target){
//         speed = -speed;
//     }
//     obj.timer = setInterval(function(){
//         let oldValue = parseInt(getStyle(obj,attr));
//         let newValue = oldValue + speed + 'px';
//         if(speed > 0 && newValue >= target || speed < 0 && newValue <= target){
//             newValue = target;
//         }
//         obj.style[attr] = newValue;
//         if(newValue == target){
//             clearInterval(obj.timer);
//             callback && callback();
//         }
//     },30);
// }
// /*
//     obj: 要获取样式的元素
//     name: 要获取样式的名称
// */
// function getStyle(obj, name) {
//     // getComputdedStyle获取某个元素的所有样式
//     if(window.getComputedStyle){
//         return window.getComputedStyle(obj,null)[name];
//     }else{
//         return obj.currentStyle()[name];
//     }
// }
