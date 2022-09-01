/*               取小值往上加区分正负                 */



// 为上滑和下滑按钮添加单击响应事件
function upbtnAdownbtn() {
    // 获取到列表
    var mcontent = document.getElementById("mcontent");
    // 获取列表框
    var middle = mcontent.parentElement;


    if (mcontent.offsetHeight - middle.offsetHeight <= 0) {
        var upbtn = document.getElementById("upbtn");
        var downbtn = document.getElementById("downbtn");
        upbtn.innerHTML = "";
        downbtn.innerHTML = "";
    } else {
        // 获取上滑按钮
        var upbtn = document.getElementById("upbtn");
        upbtn.flag1 = 0;
        upbtn.flag2 = 0;
        bind(upbtn, "mousedown", function (event) {
            event = event || window.event;
            upbtn.timer = setInterval(function () {
                // 先判断是否能上滑
                if (-parseInt(mcontent.style.top) >= mcontent.offsetHeight - middle.offsetHeight || mcontent.offsetHeight - middle.offsetHeight <= 0) {
                    if (!upbtn.flag2) {
                        // if(middle.offsetHeight-mcontent.offsetHeight > 0){
                        // move(mcontent,"top",mcontent.offsetHeight-middle.offsetHeight,1);
                        // }else if(middle.offsetHeight-mcontent.offsetHeight < 0){
                        // move(mcontent,"top",middle.offsetHeight-mcontent.offsetHeight,1);
                        // }
                        // 改变上滑按钮的内容
                        upbtn.innerHTML = "已到底部";
                        upbtn.flag2 = 1;
                    }
                    return false;
                }
                if (!upbtn.flag1) {
                    downbtn.innerHTML = "点击下滑";
                    upbtn.flag1 = 1;
                    downbtn.flag1 = 0;
                    upbtn.flag2 = 0;
                }

                // 列表上滑
                move(mcontent, "top", parseInt(parseInt(getStyle(mcontent, "top")) / 100) * 100 - 100, 8);
            }, 30);
            event.preventDefault && event.preventDefault();
        });
        bind(upbtn, "mouseup", function () {
            if (upbtn.timer) {
                clearInterval(upbtn.timer)
            }
        });
        bind(upbtn, "mouseleave", function () {
            if (upbtn.timer) {
                clearInterval(upbtn.timer)
            }
        });

        // 获取下滑按钮
        var downbtn = document.getElementById("downbtn");
        downbtn.flag1 = 0;
        downbtn.flag2 = 0;
        bind(downbtn, "mousedown", function (event) {
            event = event || window.event;
            downbtn.timer = setInterval(function () {
                // 先判断是否能下滑
                if (parseInt(mcontent.style.top) >= 0 || !parseInt(mcontent.style.top)) {
                    if (!downbtn.flag2) {
                        // move(mcontent,"top",0,1);
                        downbtn.innerHTML = "已到顶部";
                        downbtn.flag2 = 1;
                    }
                    return false;
                }
                if (!downbtn.flag1) {
                    console.log("带你就");
                    upbtn.innerHTML = "点击上滑";
                    upbtn.flag1 = 0;
                    downbtn.flag1 = 1;
                    downbtn.flag2 = 0;
                }
                // 列表下滑
                move(mcontent, "top", Math.floor(parseInt(getStyle(mcontent, "top")) / 100) * 100 + 100, 8);
            }, 30);
            event.preventDefault && event.preventDefault();
        });

        bind(downbtn, "mouseup", function () {
            if (downbtn.timer) {
                clearInterval(downbtn.timer);
            }
        });
        bind(downbtn, "mouseleave", function () {
            if (downbtn.timer) {
                clearInterval(downbtn.timer);
            }
        });
    }



}

// 为导航按钮添加点击事件
// function buttonClick(){
//     // 获取到所有的按钮
//     var buttons = document.getElementById('mcontent').getElementsByTagName('a')
//     // 为每一个按钮添加点击事件buttons为数组
//     for(let i = 0; i < buttons.length; i++){
//         bind(buttons[i],'click',function(){
//             // 去除其他按钮选中状态
//             for(let j = 0; j < buttons.length; j++){
//                 buttons[j].className = '';
//             }
//             buttons[i].className = 'lf-a-select';
//         })
//     }
// }