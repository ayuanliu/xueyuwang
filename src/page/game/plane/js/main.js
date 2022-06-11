window.onload = function () {
    // 这里不需要清除document的键盘事件是因为后面重新给document添加键盘事件
    document.onkeydown = function (event) {
        if (event.keyCode == 74) {
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
    }

}
