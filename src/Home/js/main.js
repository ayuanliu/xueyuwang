import { reqAvatar, reqGetAvatat, reqGreegySnake, reqPacificThunder, reqPutAvatar } from "../../api/index.js";
import "./showWebsite.js";
window.onload = function () {
    header_userbox();
    loginbox();
    userInfobox();
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
// header右边盒子
function header_userbox() {
    const userbox = document.querySelector('.header .userbox');
    const register = userbox.children[2];
    const avatar = userbox.children[1].children[0];
    // 查看本地是否有token有则带着token去请求用户头像
    if (localStorage.getItem('token')) {
        reqAvatar().then(response => {
            avatar.children[0].src = response;
            userbox.removeChild(userbox.children[0]);
            userbox.removeChild(userbox.children[1]);
            userbox.onmouseenter = null;
            userbox.onmouseleave = null;
            (function () {
                const userInfobox = document.querySelector('.userInfobox');
                const userInfoboxavatar = userInfobox.children[0].children[0].children[0];
                const ul = userInfobox.children[0].children[2].children[1].children[1]
                const pacificThunderScore = ul.children[0].children[1];
                const greedySnakeScore = ul.children[1].children[1];
                avatar.onclick = function () {
                    // 获取需要的数据
                    reqPacificThunder().then(response => {
                        if (response.length == 0) {
                            pacificThunderScore.innerHTML = 0;
                            return;
                        }
                        response.sort(function (a, b) {
                            return b - a;
                        })
                        pacificThunderScore.innerHTML = response[0];
                    });
                    reqGreegySnake().then(response => {
                        if (response.length == 0) {
                            greedySnakeScore.innerHTML = 0;
                            return;
                        }
                        response.sort(function (a, b) {
                            return b - a;
                        })
                        greedySnakeScore.innerHTML = response[0];
                    })
                    userInfoboxavatar.src = response;
                    userInfobox.style.display = 'block';
                }
            })(avatar)
        });
    }
    userbox.onmouseenter = function () {
        register.style.display = 'block';
        move(userbox, 'width', 200, 3);
    }
    userbox.onmouseleave = function () {
        move(userbox, 'width', 100, 5, function () {
            register.style.display = 'none';
        });
    }
    register.onclick = function () {
        // 点击跳转到注册页面
        location.href = '../../src/register/index.html'
    }
    avatar.onclick = function () {
        loginbox()
        function loginbox() {
            const loginbox = document.querySelector('.loginbox');
            loginbox.style.display = 'block';
        }
    }
}
// 登录盒子
function loginbox() {
    const loginbox = document.querySelector('.loginbox');
    const loginboxContainer = loginbox.children[0];
    const userName = loginboxContainer.children[0].children[2].children[1]
    const passWord = loginboxContainer.children[0].children[2].children[7]
    const login = loginboxContainer.children[0].children[3];
    const close = loginboxContainer.children[1]
    userName.onfocus = function () {
        this.placeholder = '';
    }
    userName.onblur = function () {
        this.placeholder = '请输入账号';
    }
    passWord.onfocus = function () {
        this.placeholder = '';
    }
    passWord.onblur = function () {
        this.placeholder = '请输入密码';
    }
    login.onclick = function (event) {
        let uName = userName.value;
        let pW = passWord.value;
        // 获取到所有的用户并且处理数据
        sendAJAX('GET', '/users', undefined, function (result) {
            const users = result;
            for (let i = 0; i < users.length; i++) {
                // 如果成功登录
                if (uName === users[i].uName && pW === users[i].pW) {
                    reqAvatar().then(response => {
                        userbox(response);
                        loginbox.style.display = 'none';
                    })
                    localStorage.setItem('token', users[i].token);
                    event.preventDefault();
                    return;
                }
            }
            console.log('账号或密码错误');
        });
        event.preventDefault();
    }
    close.onclick = function () {
        loginbox.style.display = 'none';
    }
    // 自动获取焦点
    userName.focus();

    function userbox(src) {
        const userbox = document.querySelector('.header .userbox');
        const avatar = userbox.children[1].children[0]
        avatar.children[0].src = src;
        userbox.removeChild(userbox.children[0]);
        userbox.removeChild(userbox.children[1]);
        userbox.onmouseenter = null;
        userbox.onmouseleave = null;
        avatar.onclick = function () {
            const userInfobox = document.querySelector('.userInfobox');
            const userInfoboxavatar = userInfobox.children[0].children[0].children[0];
            const ul = userInfobox.children[0].children[2].children[1].children[1]
            const pacificThunderScore = ul.children[0].children[1];
            const greedySnakeScore = ul.children[1].children[1];
            // 获取需要的数据
            reqPacificThunder().then(response => {
                if (response.length == 0) {
                    pacificThunderScore.innerHTML = 0;
                    return;
                }
                response.sort(function (a, b) {
                    return b - a;
                })
                pacificThunderScore.innerHTML = response[0];
            });
            reqGreegySnake().then(response => {
                if (response.length == 0) {
                    greedySnakeScore.innerHTML = 0;
                    return;
                }
                response.sort(function (a, b) {
                    return b - a;
                })
                greedySnakeScore.innerHTML = response[0];
            })
            userInfoboxavatar.src = src;
            userInfobox.style.display = 'block';
        }
    }
}
// 用户信息盒子
function userInfobox() {
    const userInfobox = document.querySelector('.userInfobox');
    const avatarbox = userInfobox.children[0].children[0];
    const userInfoboxAvatar = avatarbox.children[0];
    const inputFile = avatarbox.children[1];
    const close = userInfobox.children[0].children[3];
    const logout = userInfobox.children[0].children[4];
    inputFile.style.display = 'none';
    avatarbox.onclick = function (e) {
        inputFile.click();
    }
    inputFile.onchange = function (e) {
        let read = new FileReader()
        let file = e.target.files[0]
        read.readAsDataURL(file);
        read.onload = function () {
            userInfoboxAvatar.src = read.result;
            // 将图片上传到服务器
            // 获取到头像数据的id
            reqGetAvatat().then(response => {
                response.data = read.result;
                reqPutAvatar(response.id, response);
            })
        }
    }
    close.onclick = function () {
        userInfobox.style.display = 'none';
    }
    logout.onclick = function () {
        localStorage.removeItem('token');
        location.reload();
    }
}