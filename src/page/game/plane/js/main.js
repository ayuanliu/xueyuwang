window.onload = function () {
    var startMenu = document.querySelector('.startMenu');
    // 给按钮添加点击事件
    var btns = document.querySelectorAll('.btns button');
    btns[0].onclick = function() {
        let explain = document.querySelector('.explain')
        let back = document.querySelector('.explain div:first-child')
        startMenu.style.display = 'none';
        explain.style.display = 'block';
        back.onclick = function(){
            startMenu.style.display = 'block';
            explain.style.display = 'none';
        }
    }
    btns[1].onclick = function () {
        var countdown = document.querySelector('.countdown');
        startMenu.style.display = 'none';
        countdown.style.display = 'block';
        let i = 3;
        countdown.innerHTML = i;
        this.timer = setInterval(() => {
            if (i <= 0) {
                countdown.style.display = 'none';
                gameLoad();
                clearInterval(this.timer);
            } else {
                i--;
                if (i <= 0) {
                    countdown.innerHTML = '开始!';
                } else {
                    countdown.innerHTML = i;
                }
            }
        }, 1000);
    }
}



function gameLoad() {
    var menu = menuInit();
    menuScore = menu.querySelector(".score").childNodes[0];
    // 为特效单独开启一个定时器
    effects = setInterval(function () {
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
    }, 100);

    var character = characterInit();
    characterControlTimer = setInterval(function () {
        characterControl(character);
    }, 10);

    // 为角色移动单独开启一个定时器
    MoveTimer = setInterval(function () {
        characterShoot(character, bulletArr);
        characterMove(character, 3, character.up, character.down, character.left, character.right);
        // 创建怪物
        createMonster(1);
        show(character, 6, bulletArr, 1);
        rainMove();
    }, 15);
}