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
    createLinkedlist();
}
function long(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}
// 初始化有n个节点并且依次递增
function createLinkedlist() {
    // 初始化节点
    const mainbox = document.querySelector('.mainbox');
    const pointInput = document.querySelector('.point-input');
    const pointDelete = document.querySelector('.point-delete');
    const btnbox = document.querySelector('.buttonbox');
    const position = document.querySelector('.position');
    mainbox.onscroll = function () {
        pointInput.style.top = mainbox.scrollTop + 80 + 'px';
    }
    let data = null;
    let del = null;
    btnbox.children[0].onclick = function () {
        // 检测输入框是否有值
        if (data && position.value) {
            // 1.初始化插入节点后的位置及线条位置 
            // 在页面中插入并在链表中插入元素
            let div = document.createElement('div');
            div.className = 'point';
            div.style.height = 100 + 'px';
            div.appendChild(pointInput.children[0].cloneNode(true));
            div.appendChild(pointInput.children[2].cloneNode(true));
            let point = head.addPoint(div, position.value);
            insertAfter(point.next.data, point.data);
            div.style.left = (point.data.offsetLeft + point.data.offsetWidth) + 'px';
            div.style.top = (point.data.offsetHeight + point.data.offsetTop) + 'px';

            // 在页面中修改线条位置及新增线条
            div = document.createElement('div');
            div.className = 'lineB';
            mainbox.appendChild(div);
            // 获取需要使用的节点
            let point1 = point.data
            let point1_next = point.data.children[1];
            let point2 = point.next.data;
            let point2_data = point.next.data.children[0];
            // 线条两端点坐标
            let x1 = point1.offsetLeft + point1_next.offsetWidth;
            let y1 = point1.offsetTop + point1_next.offsetHeight / 2 * 3;
            let x2 = point2.offsetLeft;
            let y2 = point2.offsetTop;
            // 如果节点添加不在末尾
            if (point.next.next != null) {
                // 连接新节点
                point.line.style.height = long(x1, y1, x2, y2) + 'px';
                point.line.style.transform = 'rotate(0deg)';
                // 给插入节点添加线条
                point.next.line = div;
                // 获取需要使用的节点
                point1 = point.next.data;
                point1_next = point.next.data.children[1];
                point2 = point.next.next.data;
                point2_data = point.next.next.data.children[0];
                // 线条两端点坐标
                x1 = point1.offsetLeft + point1.offsetWidth;
                y1 = point1.offsetTop + point1_next.offsetHeight / 2 * 3;
                x2 = point2.offsetLeft;
                y2 = point2.offsetTop;
                div.style.top = y1 + 'px';
                div.style.left = x1 + 'px';
                // 计算角度
                let mDeg = Math.round(Math.atan((x2 - x1) / (y2 - y1)) * 180 / Math.PI);
                if (y1 < y2) {
                    mDeg -= 180;
                    div.className = 'lineR';
                }
                // 新节点的next连接后面的节点
                div.style.transform = "rotate(" + (-180 - mDeg) + "deg)";
                point.next.line.style.height = long(x1, y1, x2, y2) + 'px';
            } else {
                // 给插入节点的上一个节点添加线条
                // 获取需要使用的节点
                point.line = div;
                point1 = point.data;
                point1_next = point.data.children[1];
                point2 = point.next.data;
                point2_data = point.next.data.children[0];
                // 线条两端点坐标
                x1 = point1.offsetLeft + point1_next.offsetWidth;
                y1 = point1.offsetTop + point1_next.offsetHeight / 2 * 3;
                x2 = point2.offsetLeft;
                y2 = point2.offsetTop;
                div.style.top = y1 + 'px';
                div.style.left = x1 + 'px';
                // 连接新节点
                point.line.style.height = long(x1, y1, x2, y2) + 'px';
            }

            // 2.将插入的元素及线条移动到正确位置
            // 获取头节点元素
            const divh = document.querySelector('.point');
            const closeArr = point.getArr();
            point.readLinkedlist(function (point) {
                if (point.next != null) {
                    point.next.isOk = 0;
                }
            })
            // 从插入的那个节点的前一个节点开始都需要动画
            let timer = setInterval(function () {
                point.readLinkedlist(function (point) {
                    if (point.next != null) {
                        let point1 = point.data;
                        let point1_next = point.data.children[1];
                        let point1_line = point.line;
                        let point1_order = point.order;
                        let point2 = point.next.data;
                        let point2_data = point.next.data.children[0];
                        let point2_order = point.next.order;
                        // 计算插入节点后 前一个节点开始至结束的每一个节点的位置
                        let left = divh.offsetLeft + (divh.offsetWidth + divh.offsetLeft) * ((point2_order % 5));
                        let top = divh.offsetTop + (divh.offsetWidth + divh.offsetLeft) * Math.floor(point2_order / 5);
                        if (point2.offsetLeft < left) {
                            point2.style.left = point2.offsetLeft + 3 + 'px';
                            if (point2.offsetLeft > left) {
                                point2.style.left = left + 'px';
                            }
                        } else if (point2.offsetLeft > left) {
                            point2.style.left = point2.offsetLeft - 3 + 'px';
                            if (point2.offsetLeft < left) {
                                point2.style.left = left + 'px';
                            }
                        }
                        if (point2.offsetTop < top) {
                            point2.style.top = point2.offsetTop + 1 + 'px';
                            if (point2.offsetTop > top) {
                                point2.style.top = top + 'px';
                            }
                        } else if (point2.offsetTop > top) {
                            point2.style.top = point2.offsetTop - 1 + 'px';
                            if (point2.offsetTop < top) {
                                point2.style.top = top + 'px';
                            }
                        }
                        // 计算插入节点后 前一条线至结束的每一条线的摆放位置
                        let x1 = point1.offsetLeft + point1_next.offsetWidth;
                        let y1 = point1.offsetTop + point1_next.offsetHeight / 2 * 3;
                        let x2 = point2.offsetLeft;
                        let y2 = point2.offsetTop;
                        div = point.line;
                        div.style.top = y1 + 'px';
                        div.style.left = x1 + 'px';
                        // 计算角度
                        let mDeg = Math.round(Math.atan((x2 - x1) / (y2 - y1)) * 180 / Math.PI);
                        if (y1 < y2) {
                            mDeg -= 180;
                            div.className = 'lineR';
                        } else {
                            div.className = 'lineB';
                        }
                        // 新节点的next连接后面的节点
                        div.style.transform = "rotate(" + (-180 - mDeg) + "deg)";
                        div.style.height = long(x1, y1, x2, y2) + 'px';
                        // 如果所有的节点及线条位置都摆放好则关闭定时器
                        if (point2.offsetLeft == left && point2.offsetTop == top) {
                            point.next.isOk = 1;
                        }
                        for (let i = 1; i < closeArr.length; i++) {
                            if (closeArr[i].isOk == 1) { } else {
                                break;
                            }
                            if (i == closeArr.length - 1) {
                                clearInterval(timer);
                            }
                        }
                    }
                })
            }, 30);
        } else {
            alert('请输入数据');
        }
    }
    btnbox.children[1].onclick = function () {
        if (del) {
            del = parseInt(del);
            // 删除节点
            let point = head.delPoint(del, function (point, delP) {
                if (delP.line != null) {
                    mainbox.removeChild(delP.line);
                }else{
                    mainbox.removeChild(point.line);
                    point.line = null;
                }
                mainbox.removeChild(delP.data);
            });
            const divh = document.querySelector('.point');
            const closeArr = point.getArr();
            point.readLinkedlist(function (point) {
                if (point.next != null) {
                    point.next.isOk = 0;
                }
            })
            // 从插入的那个节点的前一个节点开始都需要动画
            let timer = setInterval(function () {
                point.readLinkedlist(function (point) {
                    if (point.next != null) {
                        let point1 = point.data;
                        let point1_next = point.data.children[1];
                        let point1_line = point.line;
                        let point1_order = point.order;
                        let point2 = point.next.data;
                        let point2_data = point.next.data.children[0];
                        let point2_order = point.next.order;
                        // 计算插入节点后 前一个节点开始至结束的每一个节点的位置
                        let left = divh.offsetLeft + (divh.offsetWidth + divh.offsetLeft) * ((point2_order % 5));
                        let top = divh.offsetTop + (divh.offsetWidth + divh.offsetLeft) * Math.floor(point2_order / 5);
                        if (point2.offsetLeft < left) {
                            point2.style.left = point2.offsetLeft + 3 + 'px';
                            if (point2.offsetLeft > left) {
                                point2.style.left = left + 'px';
                            }
                        } else if (point2.offsetLeft > left) {
                            point2.style.left = point2.offsetLeft - 3 + 'px';
                            if (point2.offsetLeft < left) {
                                point2.style.left = left + 'px';
                            }
                        }
                        if (point2.offsetTop < top) {
                            point2.style.top = point2.offsetTop + 1 + 'px';
                            if (point2.offsetTop > top) {
                                point2.style.top = top + 'px';
                            }
                        } else if (point2.offsetTop > top) {
                            point2.style.top = point2.offsetTop - 1 + 'px';
                            if (point2.offsetTop < top) {
                                point2.style.top = top + 'px';
                            }
                        }
                        // 计算插入节点后 前一条线至结束的每一条线的摆放位置
                        let x1 = point1.offsetLeft + point1_next.offsetWidth;
                        let y1 = point1.offsetTop + point1_next.offsetHeight / 2 * 3;
                        let x2 = point2.offsetLeft;
                        let y2 = point2.offsetTop;
                        let div = point.line;
                        div.style.top = y1 + 'px';
                        div.style.left = x1 + 'px';
                        // 计算角度
                        let mDeg = Math.round(Math.atan((x2 - x1) / (y2 - y1)) * 180 / Math.PI);
                        if (y1 < y2) {
                            mDeg -= 180;
                            div.className = 'lineR';
                        } else {
                            div.className = 'lineB';
                        }
                        // 新节点的next连接后面的节点
                        div.style.transform = "rotate(" + (-180 - mDeg) + "deg)";
                        div.style.height = long(x1, y1, x2, y2) + 'px';
                        // 如果所有的节点及线条位置都摆放好则关闭定时器
                        if (point2.offsetLeft == left && point2.offsetTop == top) {
                            point.next.isOk = 1;
                        }
                        for (let i = 1; i < closeArr.length; i++) {
                            if (closeArr[i].isOk == 1) { } else {
                                break;
                            }
                            if (i == closeArr.length - 1) {
                                clearInterval(timer);
                            }
                        }
                    }
                })
                if(point.next==null){
                    clearInterval(timer);
                }
            }, 30);
        } else {
            alert('请输入数据');
        }
    }
    function insertAfter(current, target) {
        let parent = target.parentNode;
        if (parent.lastChild == target) {
            parent.appendChild(current);
        } else {
            parent.insertBefore(current, target.nextSibling);
        }
    }
    // 初始化10个节点(不包括头节点)
    init(3);
    function init(n) {
        // 初始化头节点
        let divh = document.createElement("div");
        divh.className = 'point';
        divh.innerHTML = `<div class='data'>undefined</div><div class='next'>next</div>`;
        mainbox.appendChild(divh);
        head.data = divh;
        for (let i = 0; i < n; i++) {
            let div = document.createElement("div");
            div.className = 'point';
            div.innerHTML = `<div class='data'>${i + 1}</div><div class='next'>next</div>`
            // i+1开始是因为头节点不计算跳过%5是换行x坐标归位
            let left = divh.offsetLeft + (divh.offsetWidth + divh.offsetLeft) * (((i + 1) % 5));
            div.style.left = left + 'px';
            let top = Math.floor((i + 1) / 5);
            div.style.top = divh.offsetTop + (divh.offsetWidth + divh.offsetLeft) * top + 'px'
            mainbox.appendChild(div);
            head.addPoint(div, i + 1);
        }
        let points = head.getArr();
        points[0].data.style.height = 100 + 'px';
        var timerFlag = 0;
        let pointsIndex = 0;
        let timer = setInterval(function () {
            if (!timerFlag) {
                timerFlag = 1;
                if (pointsIndex + 1 < points.length) {
                    let point1 = points[pointsIndex].data.children[1];
                    let point2 = points[pointsIndex + 1].data.children[0];
                    let X1 = point2.parentNode.offsetLeft;
                    let Y1 = point2.parentNode.offsetTop;
                    let X2 = point1.parentNode.offsetLeft + point1.offsetWidth;
                    let Y2 = point1.parentNode.offsetTop + point1.offsetHeight / 2 * 3;

                    let div = document.createElement('div');
                    points[pointsIndex].line = div;
                    div.className = 'lineB';
                    mainbox.appendChild(div);
                    // 计算角度
                    let mDeg = Math.round(Math.atan((X2 - X1) / (Y2 - Y1)) * 180 / Math.PI);
                    if (Y2 < Y1) {
                        mDeg -= 180;
                        div.className = 'lineR';
                    }
                    // 进行旋转
                    // 设置样式
                    div.style.top = Y2 + 'px';
                    div.style.left = X2 + 'px';
                    div.style.transform = "rotate(" + (-180 - mDeg) + "deg)";
                    move(div, 'height', Math.sqrt(Math.pow(X2 - X1, 2) + Math.pow(Y2 - Y1, 2)), 10, function () {
                        move(points[pointsIndex].data, 'height', 100, 10, function () {
                            timerFlag = 0;
                        })
                    })
                    pointsIndex++;
                } else {
                    clearInterval(timer);
                }
            }
        }, 500);
    }

    pointInput.ondblclick = function () {
        let input = '<input class="input" autofocus="auto">';
        pointInput.removeChild(pointInput.children[0]);
        pointInput.insertAdjacentHTML('afterbegin', input);
        pointInput.children[0].value = data;
        pointInput.children[0].onblur = function () {
            setTimeout(() => {
                data = pointInput.children[0].value;
                let div = `<div class="data">${data}</div>`
                pointInput.removeChild(pointInput.children[0]);
                pointInput.insertAdjacentHTML('afterbegin', div);
            }, 100);
        }
    }

    pointDelete.ondblclick = function () {
        let input = '<input class="input" autofocus="auto">';
        pointDelete.removeChild(pointDelete.children[0]);
        pointDelete.insertAdjacentHTML('afterbegin', input);
        pointDelete.children[0].value = del;
        pointDelete.children[0].onblur = function () {
            setTimeout(() => {
                del = pointDelete.children[0].value;
                let div = `<div class="data">${del}</div>`;
                pointDelete.removeChild(pointDelete.children[0]);
                pointDelete.insertAdjacentHTML('afterbegin', div);
            }, 100);
        }
    }
}