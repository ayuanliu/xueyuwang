import {gameLoad} from './game.js'
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