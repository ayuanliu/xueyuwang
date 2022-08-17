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

    createDom();

}



function createDom() {

    // 获取DOM中的节点
    /**************************************************************/
    // 获取teatarea文本框
    var myHtml = document.getElementById("myHtml");
    // 获取htmlExplain盒子
    var htmlExplain = document.getElementById("htmlExplain");
    // 获取构建DOM树按钮
    var btnHtmlExplain = document.getElementById("btnHtmlExplain");
    /**************************************************************/
    // 兼容火狐写法
    myHtml.onwheel = function(event){
        if(event.wheelDelta < 0 || event.detail < 0){
            myHtml.scrollTop += 20;
        }else if(event.wheelDelta > 0){
            myHtml.scrollTop -= 20;
        }
        return false;
    }
    // 或者
    // bind(myHtml,"DOMMouseScroll",myHtml.onwheel);

    btnHtmlExplain.onclick = function () {
        // 如果html为空则初始化
        if(myHtml.value==''){
            myHtml.value =
`<html>
    <head>
        <title></title>
    </head>
<body>
    <div>
        <p></p>
    </div>
    <div>
        <i></i>
    </div>
    <div></div>
</body>
</html>`
        }
        // 在这进行解析
        var content = myHtml.value;
        var arr = new Array();
        // 第一次处理将数据分开即<html>作为1个数据并且存入数组
        arr = mySplit(content, '<', '>');


        // \/表示/创建正则表达式用来匹配
        var reg = /\//;

        // 创建盒子并将盒子添加进页面
        /**************************************************************/
        var doc = document.createElement("div");
        doc.innerHTML = "document";
        htmlExplain.appendChild(doc);
        doc.style.left = htmlExplain.offsetWidth / 2 - doc.offsetWidth / 2 + "px";
        /**************************************************************/

        // 创建根节点(头结点)
        var creatTree = new Tree(doc);
        // document作为根节点(头结点)
        var head = creatTree;

        for (let i = 0; i < arr.length; i++) {
            // 如果标签中没有'/'则创建盒子并且添加进树中有则上走
            if (!reg.test(arr[i])) {
                // 创建盒子
                let div = document.createElement("div");
                div.innerHTML = arr[i];
                creatTree = creatTree.addNode(div);
            } else {
                creatTree = creatTree.getParent(1);
            }
        }

        // 获取到每一层最大子节点数
        var layerMaxNodeNum = head.getMaxChildNumList();

        // 计算每一层的子层最多有多少节点不包括叶子节点(因为叶子节点没有)
        var layerSpace = new Array();
        var result = 1;
        for (let i = 0; i < layerMaxNodeNum.length - 1; i++) {
            result *= layerMaxNodeNum[i];
            // 每一层最大节点个数
            layerSpace[i] = result;
        }
        // 计算每个盒子的大小
        var space = htmlExplain.offsetWidth / layerSpace[layerSpace.length - 1];
        // 给每个盒子添加当前层的序号
        head.setOrder();

        // 在页面中显示DOM树
        /**************************************************************/
        // 该参数为当前遍历到的对象
        head.readTree(function (obj) {
            // 将遍历到的节点添加进页面
            htmlExplain.appendChild(obj.nodeValue);
            // 计算盒子的宽度
            obj.nodeValue.style.width = space - 5 + "px";
            if (space - 5 > 95) {
                obj.nodeValue.style.width = 95 + "px";
            }
            // 计算盒子竖直位置
            obj.nodeValue.style.top = 18 * obj.curDepth * 2 + "px";
            // 计算水平位置layerSpace[obj.prevNode.curDepth]为当前层最大节点个数
            obj.nodeValue.style.left = htmlExplain.offsetWidth / layerSpace[obj.prevNode.curDepth] / 2 + htmlExplain.offsetWidth / layerSpace[obj.prevNode.curDepth] * obj.order - obj.nodeValue.offsetWidth / 2 + "px";
        });
        /**************************************************************/
        var treeArr = head.getArr();
        var timerFlag = 0;
        let treeArrIndex = 0;
        var timer = setInterval(function () {
            if (!timerFlag) {
                timerFlag = 1;
                if (treeArrIndex < treeArr.length) {
                    // 获取父盒子的坐标
                    var Y2 = treeArr[treeArrIndex].prevNode.nodeValue.offsetTop + treeArr[treeArrIndex].prevNode.nodeValue.offsetHeight;
                    var X2 = treeArr[treeArrIndex].prevNode.nodeValue.offsetLeft + treeArr[treeArrIndex].prevNode.nodeValue.offsetWidth / 2;

                    // 获取子盒子的坐标
                    var Y1 = treeArr[treeArrIndex].nodeValue.offsetTop;
                    var X1 = treeArr[treeArrIndex].nodeValue.offsetLeft + treeArr[treeArrIndex].nodeValue.offsetWidth / 2;
                    // 计算角度
                    var mDeg = Math.round(Math.atan((X2 - X1) / (Y2 - Y1)) * 180 / Math.PI);
                    // 进行旋转
                    var mDiv = document.createElement('div');
                    htmlExplain.appendChild(mDiv);
                    // 设置样式
                    mDiv.style.width = 2 + 'px';
                    mDiv.style.top = Y2 + 'px';
                    mDiv.style.left = X2 + 'px';
                    mDiv.style.backgroundColor = "rgb(255,255,255)";
                    mDiv.style.transformOrigin = "50% 0";
                    mDiv.style.transform = "rotate(" + -mDeg + "deg)";
                    move(mDiv, 'height', Math.sqrt(Math.pow(X2 - X1, 2) + Math.pow(Y2 - Y1, 2)), 4, function () {
                        // 开启动画
                        move(treeArr[treeArrIndex].nodeValue, 'height', 18, 2, function () {
                            treeArr[treeArrIndex++].nodeValue.style.boxShadow = "2px 2px 5px rgba(0,0,0,.5)"
                            timerFlag = 0;
                        })
                    })
                } else {
                    clearInterval(timer);
                }
            }
        }, 500);
    }

}