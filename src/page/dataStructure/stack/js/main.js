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

    // 为PUSH和POP添加单击响应事件
    pushApop();
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
// 为PUSH和POP添加单击响应事件
function pushApop() {
    // 获取到栈盒子用来作为演示栈
    var memory = document.getElementById("memory");
    // 获取到队列盒子
    var qMemory = document.getElementById("qMemory");
    // 获取到栈顶指针箭头
    var arrowhead = document.getElementById("arrowhead");
    // 获取到文本框
    var content = document.getElementById("content");
    // 获取到SP文本框
    var valueSP = document.getElementById("valueSP").firstElementChild;
    var maxIndex = 5;
    var ifButton = 0;

    var queue = new Queue(maxIndex);
    var stack = new Stack(maxIndex);

    valueSP.innerHTML = stack.index;
    // 初始化
    // 给队列装好数据
    for (var i = 0; i < maxIndex; i++) {
        // 创建li盒子给队列作为等待添加数据 
        var datali = document.createElement("li");
        var dataimg = document.createElement("img");
        dataimg.src = "./image/data" + i + ".png";
        datali.appendChild(dataimg);
        datali.style.right = 64 * i + "px";
        queue.writeQueue(datali);
        qMemory.appendChild(datali);
    }

    // 获取PUSH按钮
    var btnPush = document.getElementById("btnPush");
    btnPush.onclick = function () {
        /* 
            每点击一下PUSH按钮
                1. 判断栈是否满(栈没满则继续)
                2. 判断队列是否空(队列没空则继续)
                3. index + 1    //栈顶指针加1
                4. front + 1  flag = 0  //队尾指针加1 表示此时可能为空
                5. 将队列中的一个数据入栈
        */
        if (ifButton) {
            return false;
        }
        // 判断栈是否满(栈没满则继续)
        if (stack.isFull()) {
            content.innerHTML = "栈满,请点击POP按钮弹出数据!";
            // 栈满不允许在执行下面代码
            return false;
        }
        // 判断队列是否空(没空则继续)
        if (queue.isNull()) {
            // 队列满不允许执行下面代码
            return false;
        }
        ifButton = 1;
        content.innerHTML = "压栈: 先将栈顶指针加1,SP = SP + 1,再将数据存入SP指向的地址空间";

        // 将队列中的一个数据入栈
        stack.writeStack(queue.readQueue());
        if (stack.isFull()) {
            content.innerHTML = "栈为满";
        }

        // 执行栈顶指针加1动画
        move(arrowhead, "top", parseInt(getStyle(arrowhead, "top")) - 64, 4);
        valueSP.innerText = stack.index;


        // 移动队列中的元素
        let value = queue.getNum();
        // value为元素个数
        for (var i = queue.front + 1; i < queue.front + value + 1; i++) {
            var num = i;
            if (num >= maxIndex) {
                num = num - maxIndex;
            }
            move(queue.queueArr[num], "right", parseInt(getStyle(queue.queueArr[num], "right")) - 64, 4);
        }

        move(stack.readStack(stack.index), "width", 0, 4, function () {
            memory.appendChild(stack.readStack(stack.index));
            move(stack.readStack(stack.index), "width", 64, 4, function () {
                move(stack.readStack(stack.index), "top", 64 * (maxIndex - stack.index - 1), 16, function () {
                    ifButton = 0;
                })
            });
        })
    }

    // 获取POP按钮
    var btnPop = document.getElementById("btnPop");
    btnPop.onclick = function () {
        /* 
            每点击一下POP按钮
                1. 判断栈是否空(栈没空则继续)
                2. 将栈中的一个数据入队
                3. index - 1    //栈顶指针减1
        */
        if (ifButton) {
            return false;
        }

        // 判断栈是否空(栈没空则继续)
        if (stack.isNull()) {
            content.innerHTML = "栈为空,请点击PUSH按钮添加数据!";
            // 栈空不允许执行下面代码
            return false;
        }

        // 判断队列是否满(没满则继续)
        if (queue.isFull()) {
            // 队列满不允许执行下面代码
            return false;
        }
        ifButton = 1;


        // 将栈中的一个数据入队
        queue.writeQueue(stack.readStack());




        valueSP.innerText = stack.index;
        content.innerHTML = "弹栈: 先将SP指向的地址空间中的数据移出栈,再将栈顶指针减1 SP = SP - 1"
        if (stack.index == -1) {
            content.innerHTML = "栈为空";
        }
        // 执行栈顶指针减1动画
        move(arrowhead, "top", parseInt(getStyle(arrowhead, "top")) + 64, 4);


        move(stack.readStack(stack.index + 1), "top", -64, 16, function () {
            move(stack.readStack(stack.index + 1), "width", 0, 4, function () {
                qMemory.appendChild(stack.readStack(stack.index + 1));
                stack.readStack(stack.index + 1).style.top = 0;
                let value = queue.getNum() - 1;
                stack.readStack(stack.index + 1).style.right = value * 64 + "px";
                move(stack.readStack(stack.index + 1), "width", 64, 4, function () {
                    ifButton = 0;
                });
            })
        });
    }
}
