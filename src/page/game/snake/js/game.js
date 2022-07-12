/*--------------------------------------------------------*/
/*
    菜单初始化
*/
function gameInit() {
    // 获取到游戏界面的边界
    mainScene = document.getElementById('main-scene');
    mainSceneHeight = parseInt(getStyle(mainScene, 'height'));
    mainSceneWidth = parseInt(getStyle(mainScene, 'width'));
    var wallColNum = parseInt(mainSceneHeight / wallSize);
    var wallRowNum = parseInt(mainSceneWidth / wallSize);
    // 创建墙
    for (let i = 0; i < wallColNum; i++) {
        // 创建墙
        let wall = document.createElement('div');
        wall.className = 'wall';
        wall.style.top = i * wallSize + 'px';
        mainScene.appendChild(wall);
        wall = document.createElement('div');
        wall.className = 'wall';
        wall.style.right = 0;
        wall.style.top = mainSceneHeight - (i + 1) * wallSize + 'px';
        mainScene.appendChild(wall);
    }
    for (let i = 0; i < wallRowNum; i++) {
        let wall = document.createElement('div');
        wall.className = 'wall';
        wall.style.top = 0;
        wall.style.left = mainSceneWidth - (i + 1) * wallSize + 'px';
        mainScene.appendChild(wall);
        wall = document.createElement('div');
        wall.className = 'wall';
        wall.style.bottom = 0;
        wall.style.left = i * wallSize + 'px';
        mainScene.appendChild(wall);
    }
    // 添加蛇头
    createPoint(mainScene, 'snake-head', mainSceneHeight / 2, mainSceneWidth / 2);
    // 添加蛇身
    for (let i = 1; i < snakeLength; i++) {
        if (i % 7 == 0) {
            createPoint(mainScene, 'snake-body7', mainSceneHeight / 2, mainSceneWidth / 2);
        } else if (i % 7 == 1) {
            createPoint(mainScene, 'snake-body1', mainSceneHeight / 2, mainSceneWidth / 2);
        } else if (i % 7 == 2) {
            createPoint(mainScene, 'snake-body2', mainSceneHeight / 2, mainSceneWidth / 2);
        } else if (i % 7 == 3) {
            createPoint(mainScene, 'snake-body3', mainSceneHeight / 2, mainSceneWidth / 2);
        } else if (i % 7 == 4) {
            createPoint(mainScene, 'snake-body4', mainSceneHeight / 2, mainSceneWidth / 2);
        } else if (i % 7 == 5) {
            createPoint(mainScene, 'snake-body5', mainSceneHeight / 2, mainSceneWidth / 2);
        } else if (i % 7 == 6) {
            createPoint(mainScene, 'snake-body6', mainSceneHeight / 2, mainSceneWidth / 2);
        }
    }

    // 鼠标移动获取到鼠标的位置
    mainScene.onmousemove = function (event) {
        pX = event.offsetX;
        pY = event.offsetY;
        if (event.target.className != 'main-scene') {
            pX = event.target.offsetLeft + event.offsetX;
            pY = event.target.offsetTop + event.offsetY;
        }
        // 移动的同时修改蛇头移动方向等
        var snakeHeadCenterX = snakeArr[0].offsetLeft + snakeSize / 2;
        var snakeHeadCenterY = snakeArr[0].offsetTop + snakeSize / 2;
        var rightAngleRatio = 0;
        if (pX - snakeHeadCenterX != 0) {
            rightAngleRatio = Math.abs((pY - snakeHeadCenterY) / (pX - snakeHeadCenterX));
            // 蛇头移动增量
            xIncrement = Math.sqrt(Math.pow(snakeSpeed, 2) / (Math.pow(rightAngleRatio, 2) + 1));
            yIncrement = rightAngleRatio * xIncrement;
        } else {
            xIncrement = 0;
            yIncrement = snakeSpeed;
        }
        // 蛇头移动方向
        xIncrement = (pX > snakeHeadCenterX ? 1 : -1) * xIncrement;
        yIncrement = (pY > snakeHeadCenterY ? 1 : -1) * yIncrement; 
    }
    // 空格键加速
    document.onkeydown = function (event) {
        if (event.keyCode == 32) {
            clearInterval(TimerSnakeMove);
            // 蛇的移动
            TimerSnakeMove = setInterval(function () {
                snakeMove(function () {
                    // 碰撞检测
                    collide(mainScene);
                });
            }, 8);
        }
    }
    document.onkeyup = function (event) {
        if (event.keyCode == 32) {
            clearInterval(TimerSnakeMove);
            TimerSnakeMove = setInterval(function () {
                snakeMove(function () {
                    // 碰撞检测
                    collide(mainScene);
                });
            }, 30);
        }
    }
}
/*--------------------------------------------------------*/

/*--------------------------------------------------------*/
/*
    创建蛇节点的函数
        mainScence          添加到哪个盒子里面
        top                 创建元素距离顶部多少
        left                创建元素距离左侧多少
        str                 添加元素的类名
*/
function createPoint(showScene, str, top, left) {
    var snakePoint = document.createElement('div');
    snakePoint.className = str;
    snakePoint.style.left = left + 'px';
    snakePoint.style.top = top + 'px';
    showScene.appendChild(snakePoint);
    snakePoint.style.zIndex = zIndex--;
    snakeArr[snakeArr.length] = snakePoint;
    // 添加notify属性用于告诉下一个节点是否可以移动
    snakeArr[snakeArr.length - 1].notify = 0;
}
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
/*
    添加食物
        mainScence          添加到哪个盒子里面
        top                 添加的食物距离顶部多少
        left                添加的食物距离左侧多少
        str                 添加食物的类名
*/
function createFood(showScene, str, top, left) {
    var food = document.createElement('div');
    food.className = str;
    food.style.left = left + 'px';
    food.style.top = top + 'px';
    showScene.appendChild(food);
    foodArr[foodArr.length] = food;
}
/*--------------------------------------------------------*/

/*--------------------------------------------------------*/
/*
    碰撞检测
        collide()           接口
        eatFood()           蛇吃到食物
        collideWall()       蛇撞墙
*/
function collide(showScene) {
    eatFood(showScene);
    collideWall(showScene);
}
function eatFood(showScence) {
    // 对蛇头进行检测是否碰到食物
    // 1.获取蛇头中心的位置
    let headX = snakeArr[0].offsetLeft + snakeSize / 2;
    let headY = snakeArr[0].offsetTop + snakeSize / 2;
    let judgeX1 = headX - snakeSize / 2 - foodSize / 2;
    let judgeX2 = headX + snakeSize / 2 + foodSize / 2;
    let judgeY1 = headY - snakeSize / 2 - foodSize / 2;
    let judgeY2 = headY + snakeSize / 2 + foodSize / 2;
    // 将食物简化看成圆形
    for (let i = 0; i < foodArr.length; i++) {
        let foodX = foodArr[i].offsetLeft + foodSize / 2;
        let foodY = foodArr[i].offsetTop + foodSize / 2;
        // 第一次筛选
        // 判断在大的正方形内
        if (foodX > judgeX1 && foodX < judgeX2 && foodY > judgeY1 && foodY < judgeY2) {
            // 第二次筛选
            // 精确判断两个圆是否相切(交)
            // 两点间距离
            let result = Math.sqrt(Math.pow(headX - foodX, 2) + Math.pow(headY - foodY, 2));
            // 小于半径之和
            if (result < snakeSize / 2 + foodSize / 2) {
                // 食物被吃掉
                // 移除元素
                showScence.removeChild(foodArr[i]);
                foodArr.splice(i, 1);
                // 蛇增长
                createPoint(showScence, `snake-body${Math.round(Math.random() * 6 + 1)}`, snakeArr[snakeArr.length - 1].offsetTop, snakeArr[snakeArr.length - 1].offsetLeft);
            }
        }
    }
}
function collideWall(showScence) {
    let headX = snakeArr[0].offsetLeft + snakeSize / 2;
    let headY = snakeArr[0].offsetTop + snakeSize / 2;
    if (headX - snakeSize / 2 - wallSize < 0 || headX + snakeSize / 2 + wallSize > showScence.offsetWidth || headY - snakeSize / 2 - wallSize < 0 || headY + snakeSize / 2 + wallSize > showScence.offsetHeight) {
        alert('游戏结束');
    }
}
/*--------------------------------------------------------*/



/*--------------------------------------------------------*/
/*
    主函数
*/
var snakeMove
function main() {
    // 闭包
    function closureSnakeMove() {
        // 这几个变量需要为自由变量
        var readCol = 0;
        // 用来索引到第二个节点没走过的第1组数据
        var baseIndex = 0;
        // 移动一个完整的节点需要的次数
        var moveTimesOfOne = pointSpace / snakeSpeed;
        return function snakeMove(callback) {
            // 蛇头移动
            var snakeHeadX = xIncrement + snakeArr[0].offsetLeft;
            var snakeHeadY = yIncrement + snakeArr[0].offsetTop;
            snakeArr[0].style.left = snakeHeadX + 'px';
            snakeArr[0].style.top = snakeHeadY + 'px';
            // 等蛇头移动moveTimesOfOne(一个完整的节点所需次数时再多一次时该代码不再执行)
            if (snakeArr[0].notify <= moveTimesOfOne) {
                snakeArr[0].notify++;
            }

            count++;

            // 将蛇头移动的位置都保存
            headLocus[headlocusIndex].push({ snakeHeadX, snakeHeadY })

            // 蛇头每移动完一个完整节点所需次数都会开辟一段新的数组空间存放下一组数据(一组数据指的是移动完一个完整节点的过程中的位置)
            if (count % (moveTimesOfOne) == 0) {
                headlocusIndex++;
                headLocus[headlocusIndex] = new Array();
                count = 0;
            }

            // 只有当前一个节点的notify为moveTimesOfOne + 1时才开始移动(此时移动一次)
            for (let i = 1; i < snakeArr.length; i++) {
                if (snakeArr[i - 1].notify > moveTimesOfOne) {
                    // 控制蛇身的每个节点的移动
                    snakeArr[i].style.left = headLocus[baseIndex - i][readCol].snakeHeadX + 'px'
                    snakeArr[i].style.top = headLocus[baseIndex - i][readCol].snakeHeadY + 'px'

                    if (snakeArr[i].notify <= moveTimesOfOne) {
                        snakeArr[i].notify++;
                    }
                    if (i == snakeArr.length - 1) {
                        snakeArr[i].notify = 0;
                    }
                }
                // 最后一个节点并且前一个节点通知最后一个节点移动了并且此时所有的节点都走了一个完整的节点大小(注意这里减1是因为从0开始)
                // 合起来就是最后一个节点走了一个节点的位置删除该节点走过的那组数据
                if (i == snakeArr.length - 1 && snakeArr[i - 1].notify > moveTimesOfOne && readCol == moveTimesOfOne - 1) {
                    // 删除最后一个节点走过的一组数据(轨迹数组改变)
                    headLocus.shift();
                    // 删除了一组数据轨迹数组长度减1
                    headlocusIndex--;
                    // 用来索引到第二个节点没走过的第1组数据(因为轨迹数组改变而这个就是对轨迹数组的索引)
                    baseIndex--;
                }
            }
            // 每次移动完一组数据中的一个数据readCol++(进行下一个数据)
            readCol++;
            // 当加到最后一个数据时从0开始
            if (readCol == moveTimesOfOne) {
                readCol = 0;
                // 此时第二个节点没走过的第1组数据更新
                baseIndex++;
            }
            callback && callback();
        }
    }
    snakeMove = closureSnakeMove();
    // 蛇的移动
    TimerSnakeMove = setInterval(function () {
        snakeMove(function () {
            // 碰撞检测
            collide(mainScene);
        });
    }, 50);
    // 食物的添加
    setInterval(function () {
        // 创建随机数确定食物的横坐标
        var foodX = Math.round(Math.random() * (mainSceneWidth - wallSize * 2 - foodSize) + wallSize);
        // 创建随机数确定食物的纵坐标
        var foodY = Math.round(Math.random() * (mainSceneHeight - wallSize * 2 - foodSize) + wallSize);
        // 创建随机数确定食物的样式
        var foodStyle = Math.round(Math.round(Math.random() * 24)) + 1;
        if (foodArr.length < 100) {
            createFood(mainScene, 'food' + foodStyle, foodY, foodX);
        }
    }, 2000);
}
/*--------------------------------------------------------*/