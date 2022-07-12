window.onload = function () {
    // document.body.style.zoom = 0.8;

    user();
    registerBtn()
    userBtn();
    admine();
    login();
    // 网页最佳位置
    // 当页面移到某个位置时则需要滚轮滚动很长距离才能继续移动
    document.onwheel = function (event) {
        event.preventDefault();
    }


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
        lis[i].onclick = function(){
            lis.forEach((li)=>{
                li.className = '';
            })
            lis[i].className = 'selected';
            index = i;
            // 关闭自动播放
            clearInterval(autoPlayTimer);
            move(gameList, 'left', -i * distance, 10,function(){
                // 打开自动播放
                autoChange();
            })
        }
    }
    lis[0].className = 'selected';
    gameButton.style.width = buttonNum*18 + "px";
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
                for(let i = 0; i < buttonNum - 1; i++){
                    lis[i].className = '';
                }
                lis[index].className = 'selected';
            });

        }, 5000);
    }
}