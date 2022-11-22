window.onload = function () {
    //所有数据结构页面初始化必备 
    /**************************************************************/
    // document.body.style.zoom = 0.8;
    // 获取用户头像按钮
    var userImg = document.getElementById("userImg");
    bind(userImg, "click", function () {
        alert("你好");
    });
    // 添加主页面中的
    // 左侧按钮区
    // 上滑和下滑按钮
    upbtnAdownbtn();
    // 点击左侧按钮区的按钮
    // buttonClick();
    /**************************************************************/
    
    // 为滚动条添加响应事件
    var height = document.querySelector('.header').offsetHeight;
    let newScrollTop = 0;
    let flag = 0;
    let hasListen = 0;
    document.addEventListener('scroll', function () {
        newScrollTop = document.documentElement.scrollTop;
        if (newScrollTop >= height - 25 && newScrollTop <= height + 25 && flag == 0) {
            document.documentElement.scrollTop = height;
            // hasListen保证只会设置一个定时器
            if (hasListen == 0) {
                setTimeout(function () {
                    // 可以滚动滚动条
                    flag = 1;
                    hasListen = 0;
                }, 300);
                hasListen = 1;
            }
        }
        if (newScrollTop < height - 25 || newScrollTop > height + 25) {
            flag = 0;
        }
    })
}