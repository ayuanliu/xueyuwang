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
    // 初始化
    (function () {
        let mainbox = document.querySelector('.main .showbox').children[0];
        let arr = [];
        // 计算宽度
        let width = 0;
        // 计算最后一层子节点最多多少个
        let num = 1;
        // 推入数据
        // 设置每个节点的信息及树的信息
        let info = create();
        for (let i = 0; i < info.mostChildren.length; i++) {
            num *= info.mostChildren[i];
        }
        // 计算盒子的大小 num至少为1
        width = mainbox.offsetWidth / (num || 1) / 2;
        // 将最小堆中的数据包装并显示在页面中 
        minHeap.forEach(item => {
            // 将item.nodeInfo中的数据移到item身上
            dataProxy(item, item.nodeInfo);
            // 计算每个节点在页面中的位置
            let {
                layer,
                placeInAllChildren
            } = item;
            // 整层最多节点数
            let mostChildren = info.layerMostChildren[layer];
            // 计算当前层中每个节点占据的位置大小
            let occupy = mainboxWidth / mostChildren;
            let top = layer * 80 + 20;
            let left = placeInAllChildren / mostChildren * mainboxWidth + (occupy - width) / 2;
            // 将节点的位置保留在节点本身
            Object.assign(item, { top, left });
            // 添加线条
            if (arr.length > 0) {
                let pNode = item.pNode
                let X1 = item.left + width / 2, Y1 = item.top, X2 = pNode.left + width / 2, Y2 = pNode.top + 30;
                // 计算线条旋转角度
                let rotateDeg = Math.round(Math.atan((X2 - X1) / (Y2 - Y1)) * 180 / Math.PI);
                // 计算线条的长度
                let length = Math.sqrt(Math.pow(X2 - X1, 2) + Math.pow(Y2 - Y1, 2));
                let left = pNode.left + width / 2;
                let top = pNode.top + 30 - 1;
                arr.push(
                    `<div style="width:2px;height:${length}px;left:${left}px;top:${top}px;rotate:${-rotateDeg}deg;transform-origin:50% 0">
                    </div>`
                );
            }
            // 添加节点
            let nodebox = `height: 30px;width:${width}px;left:${left}px;top:${top}px;line-height: 30px;`
            arr.push(
                `<div style="${nodebox}">
                    ${item.data}
                </div>`
            );
        })
        mainbox.innerHTML = arr.join('');

        // 按钮
        const buttonbox = document.querySelector('.buttonbox');
        const pushbtn = buttonbox.children[0];
        const popbtn = buttonbox.children[1];
        // (function () {
        //     let num = 0;
        //     pushbtn.onclick = function () {
        //         // 添加节点并将节点渲染在页面中
        //         /**************************************************************/
        //         // 点击按钮推入数据并在页面中显示需要刷新全部
        //         // 添加随机数据
        //         let data = parseInt(Math.random()*10);
        //         let point = { data }
        //         info.addPoint(point);
        //         // 将point.nodeInfo中的数据移到point身上
        //         dataProxy(point, point.nodeInfo);
        //         let width = 0,
        //             tempNum = 1;
        //         // 当num改变时重新渲染所有节点
        //         for (let i = 0; i < info.mostChildren.length; i++) {
        //             tempNum = tempNum * info.mostChildren[i];
        //         }
        //         // 
        //         let mainboxWidth = mainbox.offsetWidth;
        //         // 计算盒子的大小 num至少为1
        //         width = mainboxWidth / (tempNum || 1) / 2;
        //         // 计算节点的位置
        //         let {
        //             layer,                      // 当前层
        //             placeInAllChildren          // 整层中的位置
        //         } = point
        //         /*
        //             info.layerMostChildren[layer]                       所在层最多节点数
        //             mainboxWidth / info.layerMostChildren[layer]        当前层中每个节点占据的位置大小
        //         */
        //         let top = layer * 80 + 20;
        //         let left = placeInAllChildren / info.layerMostChildren[layer] * mainboxWidth + (mainboxWidth / info.layerMostChildren[layer] - width) / 2;
        //         // 将节点的位置保留在节点本身
        //         Object.assign(point, { top, left });
        //         // 添加线条(将数据改为响应式)
        //         if (mainbox.children.length > 0) {
        //             /* 
        //                 rotateDeg                   线条旋转角度
        //                 length                      线条长度
        //                 left                        线条的x位置
        //                 top                         线条的y位置
        //             */
        //             let pNode = point.pNode
        //             let X1 = point.left + width / 2,
        //                 Y1 = point.top,
        //                 X2 = pNode.left + width / 2,
        //                 Y2 = pNode.top + 30;
        //             let rotateDeg = Math.round(Math.atan((X2 - X1) / (Y2 - Y1)) * 180 / Math.PI),
        //                 length = Math.sqrt(Math.pow(X2 - X1, 2) + Math.pow(Y2 - Y1, 2)),
        //                 left = pNode.left + width / 2,
        //                 top = pNode.top + 30 - 1;
        //             mainbox.insertAdjacentHTML('beforeend',
        //                 `<div style="width:2px;height:${length}px;left:${left}px;top:${top}px;rotate:${-rotateDeg}deg;transform-origin:50% 0">
        //                 </div>`
        //             );
        //         }
        //         // 添加节点
        //         let nodebox = `height: 30px;width:${width}px;left:${left}px;top:${top}px;line-height: 30px;`
        //         mainbox.insertAdjacentHTML('beforeend', `
        //             <div style="${nodebox}">
        //                 ${point.data}
        //             </div>`
        //         )
        //         /**************************************************************/
        //         // 增加了新层则修改已在页面中的所有节点及线条
        //         if (num != tempNum) {
        //             num = tempNum;
        //             // 重新渲染页面
        //             minHeap.forEach((item, index) => {
        //                 let {
        //                     layer,                  // 当前层
        //                     placeInAllChildren      // 整层中的位置
        //                 } = item;
        //                 let left = placeInAllChildren / info.layerMostChildren[layer] * mainboxWidth + (mainboxWidth / info.layerMostChildren[layer] - width) / 2;
        //                 // 节点
        //                 mainbox.children[index * 2].style.width = width + 'px';
        //                 mainbox.children[index * 2].style.left = left + 'px';
        //                 Object.assign(item, { left })
        //                 if (index < 1) {
        //                     return
        //                 }
        //                 // 线条
        //                 let pNode = item.pNode;
        //                 let X1 = item.left + width / 2, 
        //                     Y1 = item.top,
        //                     X2 = pNode.left + width / 2, 
        //                     Y2 = pNode.top + 30;
        //                 // 计算线条旋转角度
        //                 let rotateDeg = Math.round(Math.atan((X2 - X1) / (Y2 - Y1)) * 180 / Math.PI);
        //                 // 计算线条的长度
        //                 let length = Math.sqrt(Math.pow(X2 - X1, 2) + Math.pow(Y2 - Y1, 2));
        //                 mainbox.children[index * 2 - 1].style.left = pNode.left + width / 2 + 'px';
        //                 mainbox.children[index * 2 - 1].style.height = length + 'px';
        //                 mainbox.children[index * 2 - 1].style.rotate = -rotateDeg + 'deg';
        //             });
        //         }
        //     }
        // })()
        (function () {
            // 将width包成对象用于监测width一改变重新渲染整个页面
            let width = 0;
            let obsWidth = {};
            Object.defineProperty(obsWidth, 'width', {
                get() {
                    return width;
                },
                set(value) {
                    width = value;
                    // 响应式
                    let mainboxWidth = mainbox.offsetWidth;
                    // 重新渲染页面
                    minHeap.forEach((item, index) => {
                        let {
                            layer,                  // 当前层
                            placeInAllChildren      // 整层中的位置
                        } = item;
                        let left = placeInAllChildren / info.layerMostChildren[layer] * mainboxWidth + (mainboxWidth / info.layerMostChildren[layer] - width) / 2;
                        // 节点
                        mainbox.children[index * 2].style.width = width + 'px';
                        mainbox.children[index * 2].style.left = left + 'px';
                        // 更新节点的left
                        Object.assign(item, { left })
                        if (index < 1) {
                            return
                        }
                        // 线条
                        let pNode = item.pNode;
                        let X1 = item.left + width / 2,
                            Y1 = item.top,
                            X2 = pNode.left + width / 2,
                            Y2 = pNode.top + 30;
                        // 计算线条旋转角度
                        let rotateDeg = Math.round(Math.atan((X2 - X1) / (Y2 - Y1)) * 180 / Math.PI);
                        // 计算线条的长度
                        let length = Math.sqrt(Math.pow(X2 - X1, 2) + Math.pow(Y2 - Y1, 2));
                        mainbox.children[index * 2 - 1].style.left = pNode.left + width / 2 + 'px';
                        mainbox.children[index * 2 - 1].style.height = length + 'px';
                        mainbox.children[index * 2 - 1].style.rotate = -rotateDeg + 'deg';
                    });
                }
            })
            let disableClick = false;
            pushbtn.onclick = function () {
                if(disableClick){
                    return;
                }
                // 添加节点并将节点渲染在页面中
                /**************************************************************/
                // 点击按钮推入数据并在页面中显示需要刷新全部
                // 添加随机数据
                let data = parseInt(Math.random() * 10);
                let point = { data }
                let process = info.addPoint(point);
                // 将point.nodeInfo中的数据移到point身上
                dataProxy(point, point.nodeInfo);
                let mainboxWidth = mainbox.offsetWidth;
                let num = 1;
                // 当num改变时重新渲染所有节点
                for (let i = 0; i < info.mostChildren.length; i++) {
                    num = num * info.mostChildren[i];
                }
                let tempWidth = 0;
                // 计算盒子的大小 num至少为1
                tempWidth = mainboxWidth / (num || 1) / 2;
                let top = point.layer * 80 + 20;
                let left = point.placeInAllChildren / info.layerMostChildren[point.layer] * mainboxWidth + (mainboxWidth / info.layerMostChildren[point.layer] - tempWidth) / 2;
                Object.assign(point, { top, left });
                // 添加线条(将数据改为响应式)
                if (mainbox.children.length > 0) {
                    /* 
                        rotateDeg                   线条旋转角度
                        length                      线条长度
                        left                        线条的x位置
                        top                         线条的y位置
                    */
                    let pNode = point.pNode
                    let X1 = left + tempWidth / 2,
                        Y1 = top,
                        X2 = pNode.left + tempWidth / 2,
                        Y2 = pNode.top + 30;
                    let rotateDeg = Math.round(Math.atan((X2 - X1) / (Y2 - Y1)) * 180 / Math.PI),
                        length = Math.sqrt(Math.pow(X2 - X1, 2) + Math.pow(Y2 - Y1, 2)),
                        lineLeft = pNode.left + tempWidth / 2,
                        lineTop = pNode.top + 30 - 1;
                    mainbox.insertAdjacentHTML('beforeend',
                        `<div style="width:2px;height:${length}px;left:${lineLeft}px;top:${lineTop}px;rotate:${-rotateDeg}deg;transform-origin:50% 0">
                        </div>`
                    );
                }
                // 添加节点
                let nodebox = `height: 30px;width:${tempWidth}px;left:${left}px;top:${top}px;line-height: 30px;`
                mainbox.insertAdjacentHTML('beforeend', `
                    <div style="${nodebox}">
                        ${data}
                    </div>`
                )
                if (obsWidth.width != tempWidth) {
                    obsWidth.width = tempWidth;
                }
                /**************************************************************/
                // 上滤 
                // 当上滤动画正在进行时禁止点击按钮
                (function () {
                    let index = 0;
                    let preNode = null, prePNode = null;
                    if (process.length > 0) {
                        // 禁用按钮
                        disableClick = true;
                        let timer = setInterval(function () {   
                            // 先清除先前节点的颜色
                            if (preNode) {
                                preNode.style.backgroundColor = '';
                                prePNode.style.backgroundColor = '';
                            }
                            let temp = mainbox.children[process[index].index * 2].innerHTML;
                            // 标红要交换的两个节点
                            preNode = mainbox.children[process[index].index * 2];
                            prePNode = mainbox.children[process[index].pIndex * 2];
                            mainbox.children[process[index].index * 2].style.backgroundColor = 'red';
                            mainbox.children[process[index].pIndex * 2].style.backgroundColor = 'red';
                            mainbox.children[process[index].index * 2].innerHTML = mainbox.children[process[index].pIndex * 2].innerHTML
                            mainbox.children[process[index].pIndex * 2].innerHTML = temp
                            index++;
                            if (index >= process.length) {
                                setTimeout(function () {
                                    preNode.style.backgroundColor = '';
                                    prePNode.style.backgroundColor = '';
                                    flag = 0;
                                    disableClick = false;
                                }, 1000);
                                clearInterval(timer);
                            }
                        }, 1000);
                    }
                })()
            }
        })()
        popbtn.onclick = function () {
            // 弹出数据(根节点)
            let obj = info.delPoint();
            if(obj.data==null){
                return;
            }
            if(obj.process[0].replace == obj.process[0].alter){
                mainbox.removeChild(mainbox.children[obj.process[0].alter*2]);
                return
            }
            // 先替换根节点
            mainbox.children[obj.process[0].replace*2].innerHTML = mainbox.children[obj.process[0].alter*2].innerHTML;
            // 删除用来替换的节点即对应的线条
            mainbox.removeChild(mainbox.children[obj.process[0].alter*2]);
            mainbox.removeChild(mainbox.children[obj.process[0].alter*2-1]);
            // 下滤
        }
    })();


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