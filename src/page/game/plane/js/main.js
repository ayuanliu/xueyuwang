import { gameLoad } from './game.js'
import { getLeaderboard } from './menu/menu.js';
import { outInShowData } from './showData/showData.js';
window.onload = function () {
    var startMenu = document.querySelector('.startMenu');
    // 给按钮添加点击事件
    var btns = document.querySelectorAll('.btns button');
    btns[0].onclick = function () {
        let explain = document.querySelector('.explain')
        let back = document.querySelector('.explain div:first-child')
        startMenu.style.display = 'none';
        explain.style.display = 'block';
        back.onclick = function () {
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
                    outInShowData();
                } else {
                    countdown.innerHTML = i;
                }
            }
        }, 1000);
    }
    btns[2].onclick = function () {
        const leaderboard = document.querySelector('.leaderboard');
        const totalPage = document.querySelector('.leaderboard .totalPage span');
        const close = document.querySelector('.leaderboard .close');
        const btnLeft = document.querySelector('.pager #btnLeft');
        const btnRight = document.querySelector('.pager #btnRight');
        const userName = document.querySelector('.userName span');
        const userScore = document.querySelector('.userscore span');
        getLeaderboard(function (data) {
            let span = document.querySelector('.pager span');
            // 将数据更新给排行榜
            // 总页数
            totalPage.innerHTML = data.length;
            // 当前页
            userName.innerHTML = data[0].id;
            userScore.innerHTML = data[0].score;
            span.innerHTML = 1;
            // 返回
            close.onclick = function () {
                startMenu.style.display = 'block';
                leaderboard.style.display = 'none';
            }
            btnLeft.onclick = function(){
                // 获取当前页
                let curPage = parseInt(span.innerHTML);
                if(curPage > 1){
                    curPage--;
                    userName.innerHTML = data[curPage-1].id;
                    userScore.innerHTML = data[curPage-1].score;
                    span.innerHTML = curPage;
                }
            }
            btnRight.onclick = function(){
                // 获取当前页
                let curPage = parseInt(span.innerHTML);
                if(curPage < data.length){
                    curPage++;
                    userName.innerHTML = data[curPage-1].id;
                    userScore.innerHTML = data[curPage-1].score;
                    span.innerHTML = curPage;
                }
            }
            // 显示排行榜
            startMenu.style.display = 'none';
            leaderboard.style.display = 'block';
        });
    }
    btns[3].onclick = function(){
        history.back();
    }
}