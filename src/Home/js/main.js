import { } from "./showWebsite.js";
window.onload = function () {
    // document.body.style.zoom = 0.8;

    user();
    registerBtn()
    userBtn();
    admine();
    login();

    // 轮播图
    swiper();

    // 旋转图
    studySwiper();
}
function swiper() {
    // 在这制作游戏轮播图
    var gameList = document.getElementById('gameList');
    var gameArr = gameList.children;
    var distance = gameList.offsetWidth / gameArr.length;
    var gameButton = document.getElementById('gameButton');
    var lis = new Array();
    var buttonNum = gameArr.length;
    var index = 0;
    var autoPlayTimer;
    // 根据图片的个数创建按钮的个数
    for (let i = 0; i < buttonNum - 1; i++) {
        lis[i] = document.createElement('li');
        gameButton.appendChild(lis[i]);
        lis[i].onclick = function () {
            lis.forEach((li) => {
                li.className = '';
            })
            lis[i].className = 'selected';
            index = i;
            // 关闭自动播放
            clearInterval(autoPlayTimer);
            move(gameList, 'left', -i * distance, 10, function () {
                // 打开自动播放
                autoChange();
            })
        }
    }
    lis[0].className = 'selected';
    gameButton.style.width = buttonNum * 18 + "px";
    // 按钮放的位置
    gameButton.style.left = 0;
    gameButton.style.right = 0;
    gameButton.style.top = 250 + "px";

    // 自动切换
    autoChange();
    function autoChange() {
        // index = 0;
        autoPlayTimer = setInterval(function () {
            index++;
            move(gameList, 'left', -index * distance, 10, function () {
                if (index >= gameArr.length - 1) {
                    index = 0;
                    gameList.style['left'] = 0;
                }
                // 移动完图片后移动按钮
                for (let i = 0; i < buttonNum - 1; i++) {
                    lis[i].className = '';
                }
                lis[index].className = 'selected';
            });

        }, 5000);
    }
}
function studySwiper() {
    // 在这制作self-study轮播图
    let study = document.querySelector('.study');
    let buttonL = document.querySelector('.buttonL');
    let buttonR = document.querySelector('.buttonR');
    let studyArr = study.children;
    let autoPlayTimer = 0;
    let index = 0;
    buttonL.onclick = function () {
        // 关闭自动播放
        clearInterval(autoPlayTimer);
        index--;
        if (index <= -studyArr.length) {
            moveRotate(study, 'transform', -60 * index, 1, function () {
                index = 0
                study.style.transform = 'rotateY(0)';
                autoChange();
            })
            return;
        }
        moveRotate(study, 'transform', -60 * index, 1, function () {
            autoChange();
        })
    }
    buttonR.onclick = function () {
        // 关闭自动播放
        clearInterval(autoPlayTimer);
        index++;
        if (index >= studyArr.length) {
            moveRotate(study, 'transform', -60 * index, 1, function () {
                index = 0
                study.style.transform = 'rotateY(0)';
                autoChange();
            })
            return;
        }
        moveRotate(study, 'transform', -60 * index, 1, function () {
            autoChange();
        })
    }
    // 自动切换
    autoChange();
    function autoChange() {
        autoPlayTimer = setInterval(function () {
            index++;
            moveRotate(study, 'transform', -60 * index, 1, function () {
                if (index >= studyArr.length) {
                    index = 0;
                    study.style.transform = 'rotateY(0)';
                }
            });
        }, 3000);
    }
    // 旋转动画
    /*
        obj: 要改变样式的元素
        attr: 要改变的样式
        target: 改变的最终结果
        speed: 改变的速度
        callback: 回调函数
    */
    function moveRotate(obj, attr, target, speed, callback) {

        clearInterval(obj.timer);
        if (obj.style[attr] === '') {
            obj.style[attr] = `rotate(0)`;
        }
        let reg = /[-\d]/g;
        let current = obj.style[attr];
        let result = [];
        let temp = null;
        // 对current进行正则提取出数字
        while (temp = reg.exec(current)) {
            temp = temp[0];
            result[result.length] = temp;
        }
        // current此时为数字
        current = parseInt(result.join(''));

        if (current > target) {
            speed = -speed;
        }
        obj.timer = setInterval(function () {
            current = obj.style[attr];
            result = [];
            // 对current进行正则提取出数字
            while (temp = reg.exec(current)) {
                temp = temp[0];
                result[result.length] = temp;
            }
            // current此时为数字
            current = parseInt(result.join(''));
            var oldValue = current;
            var newValue = oldValue + speed;
            if (speed < 0 && newValue < target || speed > 0 && newValue > target) {
                newValue = target;
            }
            obj.style[attr] = 'rotateY(' + newValue + "deg)";
            if (newValue == target) {
                clearInterval(obj.timer);
                callback && callback();
            }
        }, 15);
    }
}