window.onload = function () {
    // 初始化
    gameInit();
    document.addEventListener('keydown', function func(){
        main();
        document.removeEventListener('keydown',func,false);
    }, false)
}
