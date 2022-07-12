window.onload = function () {
    // 初始化
    gameInit();
    document.addEventListener('keydown', function func(event) {
        if (event.keyCode == 74) {
            main();
            document.removeEventListener('keydown', func, false);
        }
    }, false)
}
